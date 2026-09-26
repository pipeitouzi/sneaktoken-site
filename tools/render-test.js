/* Runtime render test: loads each page in jsdom, runs app.js, asserts the
   dynamic blocks actually produced content.
   Usage: NODE_PATH=<node workspace>/node_modules node tools/render-test.js */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const SITE = path.join(__dirname, "..", "site");
const pages = ["index.html", "models.html", "cost.html", "buy.html", "deploy.html", "market.html", "method.html"];

const expectations = {
  "index.html": [
    ["#wizard .opt", 6, "picker options"],
    ["#moves .mrow", 3, "price moves"],
    ["#faqList details", 4, "FAQ entries"]
  ],
  "models.html": [
    ["#mList .mrow", 20, "model rows"],
    ["#cmpBody tr", 20, "compare rows"],
    ["#fVendors .chip", 5, "vendor chips"]
  ],
  "cost.html": [
    ["#cModel option", 20, "model options"],
    ["#cBreak li", 5, "cost breakdown rows"],
    ["#cCmp tr", 6, "comparison rows"],
    ["#beGpu option", 10, "GPU options"]
  ],
  "buy.html": [
    ["#channels .card", 5, "channel cards"],
    ["#entCheck li", 8, "checklist items"]
  ],
  "deploy.html": [
    ["#engines tr", 5, "engine rows"],
    ["#quant tr", 5, "quantisation rows"],
    ["#hwTable tr", 10, "hardware rows"],
    ["#vCards tr", 10, "vram card rows"]
  ],
  "market.html": [
    ["#moves .mrow", 3, "price moves"],
    ["#cmpBody tr", 20, "snapshot rows"]
  ],
  "method.html": [["#faqList details", 4, "FAQ entries"]]
};

let bad = 0;
(async () => {
  for (const p of pages) {
    const html = fs.readFileSync(path.join(SITE, p), "utf8");
    const dom = new JSDOM(html, { runScripts: "dangerously", url: "https://sneaktoken.com/" + p, pretendToBeVisual: true });
    const { window } = dom;
    // inject the data + app scripts in document order (jsdom does not fetch relative src)
    for (const s of ["data/models.js", "data/site.js", "assets/app.js"]) {
      const el = window.document.createElement("script");
      el.textContent = fs.readFileSync(path.join(SITE, s), "utf8");
      window.document.body.appendChild(el);
    }
    const errs = [];
    window.addEventListener("error", e => errs.push(e.message));
    await new Promise(r => setTimeout(r, 60));

    console.log("\n== " + p);
    for (const [sel, min, label] of (expectations[p] || [])) {
      const n = window.document.querySelectorAll(sel).length;
      const ok = n >= min;
      if (!ok) bad++;
      console.log(`  ${ok ? "ok  " : "FAIL"} ${label}: ${n} (need >= ${min})`);
    }
    // value sanity
    if (p === "cost.html") {
      const total = window.document.querySelector("#cTotal").textContent;
      console.log("  monthly total: " + total);
      if (!/^\$\d/.test(total)) { bad++; console.log("  FAIL total not computed"); }
      console.log("  break-even: " + window.document.querySelector("#bePoint").textContent +
        " · gpu/mo: " + window.document.querySelector("#beGpuCost").textContent);
    }
    if (p === "deploy.html") {
      console.log("  working set: " + window.document.querySelector("#vTotal").textContent +
        " · weights: " + window.document.querySelector("#vWeights").textContent +
        " · kv: " + window.document.querySelector("#vKvOut").textContent);
    }
    if (p === "index.html") {
      const first = window.document.querySelector(".pick-card");
      console.log("  picker default state: " + (first ? "renders candidates" : window.document.querySelector("#pickOut").textContent.trim().slice(0, 60)));
    }
    if (errs.length) { bad++; console.log("  FAIL js errors: " + errs.join(" | ")); }
    dom.window.close();
  }
  console.log(bad ? "\nFAILURES: " + bad : "\nOK — every page rendered as expected");
  process.exit(bad ? 1 : 0);
})();
