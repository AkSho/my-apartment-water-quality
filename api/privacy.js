const { renderPrivacy } = require("../lib/water-hardness-template");

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
  res.status(200).send(renderPrivacy());
};
