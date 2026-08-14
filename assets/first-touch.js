(function () {
  var KEY = "myapt_ft";
  var INTERNAL = "ag_internal";
  if (localStorage.getItem(INTERNAL) === "1") return;
  if (localStorage.getItem(KEY)) return;

  var params = new URLSearchParams(location.search);
  var ref = document.referrer || "";
  var src = "direct";

  if (ref) {
    try {
      var host = new URL(ref).hostname.toLowerCase();
      if (host.indexOf("google.") !== -1) src = "google";
      else if (host.indexOf("bing.") !== -1) src = "bing";
      else if (host.indexOf("facebook.") !== -1 || host.indexOf("instagram.") !== -1 || host.indexOf("fb.") !== -1) src = "meta";
      else if (host.indexOf("reddit.") !== -1) src = "reddit";
      else if (host.indexOf("medium.") !== -1) src = "medium";
      else src = host;
    } catch (e) { src = "direct"; }
  }

  var utm = {};
  params.forEach(function (v, k) {
    if (k.indexOf("utm_") === 0) utm[k] = v;
  });

  localStorage.setItem(KEY, JSON.stringify({
    src: src,
    ref: ref,
    lp: location.pathname,
    ts: new Date().toISOString(),
    utm: utm
  }));
})();
