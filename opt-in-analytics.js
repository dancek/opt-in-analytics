(function() {
  const storageKey = "opt-in-analytics";

  function logVisit(elem, tid) {
    elem.innerText = "Logging pageview..."

    const data = {
      v: 1,
      tid: tid,
      t: "pageview",
      cid: `anonymous-${Math.random().toString(36).substring(2)}`,
      dl: document.location.toString()
    };
    const body = Object.keys(data).map(k => `${k}=${encodeURIComponent(data[k])}`).join('&');
    fetch("https://www.google-analytics.com/collect", {
      method: "POST",
      body: body
    }).then(() => { elem.innerText = "Pageview logged. Thank you!"; });
  }

  function injectAnalyticsJs(elem, tid) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', tid, 'auto');
    ga('send', 'pageview');

    elem.innerText = "Full tracking enabled. Thank you!";
  }

  function initButtons(wrapper, tid) {
    const logSingle = document.createElement("button");
    const logAlways = document.createElement("button");
    const logAny = document.createElement("button");

    wrapper.appendChild(logSingle);
    wrapper.appendChild(logAlways);
    wrapper.appendChild(logAny);

    logSingle.innerText = "Log this pageview";
    logAlways.innerText = "Log all my pageviews";
    logAny.innerText = "Track me however you wish";

    logSingle.onclick = () => logVisit(wrapper, tid);
    logAlways.onclick = () => { localStorage.setItem(storageKey, "true"); logVisit(wrapper, tid); }
    logAny.onclick = () => { localStorage.setItem(storageKey, "any"); injectAnalyticsJs(wrapper, tid); }
  }

  function init(script, tid) {
    const mode = localStorage.getItem(storageKey);
    const wrapper = document.createElement("div");

    if (mode === "true") {
      logVisit(wrapper, tid);
    } else if (mode === "any") {
      injectAnalyticsJs(wrapper, tid);
    } else {
      initButtons(wrapper, tid);
    }

    script.parentNode.insertBefore(wrapper, script);
  }

  const attr = "data-google-analytics-id";
  const scripts = document.querySelectorAll(`script[${attr}]`);
  if (scripts.length = 0) console.error(`Need to set ${attr} for the opt-in-analytics script tag!`);
  else if (scripts.length > 1) console.error("Only one opt-in-analytics script per page is currently supported!");
  else {
    const script = scripts[0];
    const tid = script.getAttribute(attr);
    init(script, tid);
  }
})();
