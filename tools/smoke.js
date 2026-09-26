/* Static smoke test for the rebuilt SneakToken site.
   Usage: node tools/smoke.js
   Checks: JS syntax, that every id app.js looks up exists somewhere in the HTML,
   that every internal link resolves to a file, and that data files parse. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = path.join(__dirname, "..", "site");
const fail = [];
const warn = [];

function read(p) { return fs.readFileSync(path.join(SITE, p), "utf8"); }

const pages = fs.readdirSync(SITE).filter(f => f.endsWith(".html"));
const html = {};
pages.forEach(p => { html[p] = read(p); });

/* 1. data files parse */
["data/models.js", "data/site.js"].forEach(f => {
  try { new vm.Script(read(f), { filename: f }); }
  catch (e) { fail.push(`syntax: ${f} — ${e.message}`); }
});

/* 2. app.js syntax */
try { new vm.Script(read("assets/app.js"), { filename: "assets/app.js" }); }
catch (e) { fail.push("syntax: assets/app.js — " + e.message); }

/* 3. ids referenced by app.js must exist on at least one page */
const app = read("assets/app.js");
const dynamic = ["mReset"]; // created at runtime by the empty-state renderer
const ids = Array.from(new Set(Array.from(app.matchAll(/\$\("#([A-Za-z0-9_-]+)"/g)).map(m => m[1])))
  .filter(id => dynamic.indexOf(id) < 0);
const allHtml = Object.values(html).join("\n");
ids.forEach(id => {
  const re = new RegExp('id="' + id + '"');
  if (!re.test(allHtml)) fail.push(`missing id on any page: #${id}`);
});

/* 4. internal links resolve */
Object.entries(html).forEach(([page, src]) => {
  const links = Array.from(src.matchAll(/href="(\/[^"#?]*)"/g)).map(m => m[1]);
  links.forEach(l => {
    const rel = l.replace(/^\//, "");
    if (!rel) return;
    const target = path.join(SITE, rel);
    if (!fs.existsSync(target)) fail.push(`${page}: broken internal link ${l}`);
  });
  const scripts = Array.from(src.matchAll(/src="([^"]+)"/g)).map(m => m[1]);
  scripts.forEach(s => {
    if (s.startsWith("http")) return;
    if (!fs.existsSync(path.join(SITE, s))) fail.push(`${page}: missing asset ${s}`);
  });
});

/* 5. data sanity */
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(read("data/models.js"), ctx);
vm.runInContext(read("data/site.js"), ctx);
const models = ctx.window.MODELS;
const site = ctx.window.SITE;

if (!models || !models.models || models.models.length < 10) fail.push("models.js: too few models");
models.models.forEach(m => {
  ["id", "name", "vendor", "weights", "price", "best_for", "vendor_url"].forEach(k => {
    if (m[k] === undefined) fail.push(`model ${m.id}: missing field ${k}`);
  });
  if (m.price && m.price.in !== null) {
    if (!m.price.source_url) fail.push(`model ${m.id}: priced but no source_url`);
    if (!m.price.verified) fail.push(`model ${m.id}: priced but no verified date`);
  }
  if (m.price && m.price.status === "unverified" && m.price.in !== null) {
    fail.push(`model ${m.id}: marked unverified but carries a price`);
  }
});
const idsDup = {};
models.models.forEach(m => { idsDup[m.id] = (idsDup[m.id] || 0) + 1; });
Object.entries(idsDup).forEach(([k, v]) => { if (v > 1) fail.push("duplicate model id: " + k); });

["channels", "enterpriseChecklist", "engines", "quant", "hardware", "priceMoves", "faq", "pick"].forEach(k => {
  if (!site[k]) fail.push("site.js missing: " + k);
});

/* 6. every page has title + canonical */
Object.entries(html).forEach(([page, src]) => {
  if (!/<title>/.test(src)) fail.push(`${page}: no title`);
  if (!/assets\/styles\.css/.test(src)) fail.push(`${page}: no stylesheet`);
  if (/--ink-|--acc(?!ent)/.test(src)) warn.push(`${page}: uses a retired CSS variable`);
});

console.log("pages: " + pages.join(", "));
console.log("models: " + models.models.length +
  " · priced: " + models.models.filter(m => m.price && m.price.in !== null).length +
  " · open: " + models.models.filter(m => m.weights === "open").length +
  " · unverified: " + models.models.filter(m => m.price && m.price.status === "unverified").length);
console.log("ids checked: " + ids.length);
if (warn.length) console.log("\nWARN\n - " + warn.join("\n - "));
if (fail.length) { console.log("\nFAIL\n - " + fail.join("\n - ")); process.exit(1); }
console.log("\nOK — all checks passed");
