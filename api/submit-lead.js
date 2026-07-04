const fs = require("fs");
const path = require("path");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const zipPattern = /^\d{5}$/;

function loadLookup() {
  const lookupPath = path.join(process.cwd(), "data", "hardness-lookup.json");
  return JSON.parse(fs.readFileSync(lookupPath, "utf8"));
}

function findHardness(lookup, zip) {
  const exact = lookup.zips && lookup.zips[zip];
  if (exact) return exact;

  const prefixes = lookup.estimated_prefixes || {};
  const prefix = Object.keys(prefixes)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => zip.startsWith(candidate));

  if (!prefix) return null;

  return {
    zip,
    ...prefixes[prefix],
    estimated: true
  };
}

async function syncToEsp(_lead) {
  return { skipped: true, reason: "ESP provider not configured" };
}

function airtableConfig() {
  return {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName: process.env.AIRTABLE_TABLE_NAME
  };
}

function airtableFields(lead) {
  return {
    email: lead.email,
    zip: lead.zip,
    hardness_ppm: lead.hardness_ppm,
    hardness_band: lead.hardness_band,
    hardness_estimated: lead.hardness_estimated,
    utm_source: lead.utm_params.utm_source || "",
    utm_medium: lead.utm_params.utm_medium || "",
    utm_campaign: lead.utm_params.utm_campaign || "",
    utm_content: lead.utm_params.utm_content || "",
    utm_term: lead.utm_params.utm_term || "",
    timestamp: lead.timestamp,
    source_url: lead.source_url || ""
  };
}

function airtableVisibleFields(lead) {
  return {
    "Email Address": lead.email,
    "Zip Code": lead.zip,
    "Source/Page": lead.source_url || "MyApartmentWaterQuality.com"
  };
}

async function postAirtableRecord(config, fields) {
  const endpoint = `https://api.airtable.com/v0/${encodeURIComponent(config.baseId)}/${encodeURIComponent(config.tableName)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      records: [
        {
          fields
        }
      ]
    })
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      detail: (await response.text()).slice(0, 500)
    };
  }

  const payload = await response.json();
  return {
    ok: true,
    id: payload.records && payload.records[0] && payload.records[0].id
  };
}

async function writeToAirtable(lead) {
  const config = airtableConfig();
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    return {
      ok: false,
      error: "airtable_not_configured",
      missing
    };
  }

  const primary = await postAirtableRecord(config, airtableFields(lead));
  if (primary.ok) {
    return {
      ...primary,
      field_mode: "launch_schema"
    };
  }

  const fallback = await postAirtableRecord(config, airtableVisibleFields(lead));
  if (fallback.ok) {
    return {
      ...fallback,
      field_mode: "visible_table_schema"
    };
  }

  if (!fallback.ok) {
    return {
      ok: false,
      error: "airtable_write_failed",
      status: fallback.status,
      detail: fallback.detail,
      first_attempt: {
        status: primary.status,
        detail: primary.detail
      }
    };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const body = req.body || {};
  const email = String(body.email || "").trim();
  const zip = String(body.zip || "").trim();
  const timestamp = body.timestamp || new Date().toISOString();
  const utmParams = body.utm_params && typeof body.utm_params === "object"
    ? body.utm_params
    : {};

  if (!emailPattern.test(email)) {
    res.status(400).json({ ok: false, error: "invalid_email" });
    return;
  }

  if (!zipPattern.test(zip)) {
    res.status(400).json({ ok: false, error: "invalid_zip" });
    return;
  }

  const lookup = loadLookup();
  const hardness = findHardness(lookup, zip);
  const lead = {
    email,
    zip,
    timestamp,
    utm_params: utmParams,
    hardness_ppm: hardness ? hardness.ppm : null,
    hardness_band: hardness ? hardness.band : null,
    hardness_estimated: Boolean(hardness && hardness.estimated),
    source_url: hardness ? hardness.source_url : ""
  };

  console.log(JSON.stringify({
    event: "water_report_lead_submitted",
    lead
  }));

  await syncToEsp(lead);

  const airtable = await writeToAirtable(lead);
  if (!airtable.ok) {
    console.error(JSON.stringify({
      event: "water_report_airtable_failed",
      error: airtable
    }));
    res.status(502).json({
      ok: false,
      error: airtable.error,
      missing: airtable.missing
    });
    return;
  }

  res.status(200).json({
    ok: true,
    lead_id: airtable.id,
    field_mode: airtable.field_mode,
    hardness_band: lead.hardness_band,
    hardness_ppm: lead.hardness_ppm,
    estimated: lead.hardness_estimated
  });
};

module.exports._test = {
  airtableFields,
  airtableVisibleFields,
  findHardness
};
