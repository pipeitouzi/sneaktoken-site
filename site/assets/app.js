/* SneakToken — interaction layer
   Reads window.MODELS (data/models.js) and window.SITE (data/site.js).
   No tracking, no external calls, no keys. Everything below runs in the browser. */
(function () {
  "use strict";

  var M = window.MODELS || { meta: {}, models: [] };
  var S = window.SITE || {};
  var ALL = M.models || [];

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) {
    if (n === null || n === undefined || isNaN(n)) return "unknown";
    if (n >= 1) return "$" + n.toFixed(2);
    return "$" + String(parseFloat(n.toFixed(4)));
  }
  function num(n, d) {
    if (n === null || n === undefined || isNaN(n)) return "unknown";
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 0 : d });
  }

  /* The price a buyer actually pays: first-party if published, otherwise the
     cheapest published third-party host rate. Never invented. */
  function effPrice(m) {
    if (m.price && m.price.in !== null) {
      return { in: m.price.in, cached_in: m.price.cached_in, out: m.price.out, via: m.vendor, status: m.price.status };
    }
    var hosts = (m.hosts || []).filter(function (h) { return h.in !== null; });
    if (hosts.length) {
      var h = hosts.slice().sort(function (a, b) { return (a.out || 0) - (b.out || 0); })[0];
      return { in: h.in, cached_in: h.cached_in, out: h.out, via: h.provider, status: "host" };
    }
    return { in: null, cached_in: null, out: null, via: null, status: "unknown" };
  }

  function vendors() {
    var v = {};
    ALL.forEach(function (m) { v[m.vendor] = 1; });
    return Object.keys(v).sort();
  }
  function allTags() {
    var t = {};
    ALL.forEach(function (m) { (m.tags || []).forEach(function (x) { t[x] = 1; }); });
    return Object.keys(t).sort();
  }

  /* ---------------- global chrome ---------------- */
  var y = new Date().getFullYear();
  $$("#year").forEach(function (e) { e.textContent = y; });

  var path = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(function (a) {
    var href = a.getAttribute("href").split("/").pop();
    if (href === path) a.classList.add("on");
  });

  var tgl = $(".nav-toggle");
  if (tgl) tgl.addEventListener("click", function () { $(".nav").classList.toggle("open"); });

  $$("[data-count]").forEach(function (e) {
    var k = e.getAttribute("data-count");
    if (k === "models") e.textContent = ALL.length;
    if (k === "verified") e.textContent = ALL.filter(function (m) { return m.price && m.price.status === "verified"; }).length;
    if (k === "priced") e.textContent = ALL.filter(function (m) { return effPrice(m).out !== null; }).length;
    if (k === "open") e.textContent = ALL.filter(function (m) { return m.weights === "open"; }).length;
    if (k === "asof") e.textContent = M.meta.asof;
  });

  /* ---------------- model rows ---------------- */
  function rowHTML(m) {
    var p = effPrice(m);
    var open = m.weights === "open";
    var tags = (m.tags || []).slice(0, 4).map(function (t) {
      return '<span class="tag' + (t === "open-weights" ? " ok" : t === "eu" ? " violet" : t === "long-context" ? " info" : "") + '">' + esc(t) + "</span>";
    }).join("");
    var hs = (m.hosts || []).map(function (h) {
      return "<dt>" + esc(h.provider) + "</dt><dd>" + money(h.in) + " in / " + money(h.out) + " out" +
        (h.cached_in !== null ? " / " + money(h.cached_in) + " cached" : "") + "</dd>";
    }).join("");

    return '<article class="mrow" id="m-' + esc(m.id) + '" data-id="' + esc(m.id) + '">' +
      '<div class="mrow-top">' +
        '<span class="mrow-name">' + esc(m.name) + "</span>" +
        '<span class="mrow-vendor">' + esc(m.vendor) + "</span>" +
        '<span class="mrow-price">' +
          "<span>in <b>" + money(p.in) + "</b></span>" +
          "<span>cached <b>" + money(p.cached_in) + "</b></span>" +
          "<span>out <b>" + money(p.out) + "</b></span>" +
        "</span>" +
      "</div>" +
      '<div class="mrow-meta">' +
        '<span class="tag ' + (open ? "ok" : "") + '">' + (open ? "open weights" : "closed") + "</span>" +
        '<span class="tag">' + esc(m.context || "context n/a") + "</span>" +
        (m.license ? '<span class="tag">' + esc(m.license) + "</span>" : "") +
        tags +
      "</div>" +
      '<p class="mrow-note">' + esc(m.best_for) + "</p>" +
      '<div class="mrow-foot">' +
        '<button class="disclose" type="button" data-toggle="' + esc(m.id) + '">Details &amp; sources</button>' +
        (p.via && p.status === "host" ? "<span>priced via " + esc(p.via) + " (hosted)</span>" : "") +
        (m.price && m.price.status === "unverified" ? '<span class="tag warn">price unverified</span>' : "") +
      "</div>" +
      '<div class="details" id="d-' + esc(m.id) + '">' +
        "<dl>" +
          "<dt>Model ID</dt><dd class=\"mono\">" + esc(m.model_id) + "</dd>" +
          "<dt>Context</dt><dd>" + esc(m.context || "not published") + (m.context_note ? " — " + esc(m.context_note) : "") + "</dd>" +
          "<dt>Modalities</dt><dd>" + esc((m.modalities || []).join(", ")) + "</dd>" +
          "<dt>Tool calling</dt><dd>" + (m.tools ? "yes" : "not confirmed") + "</dd>" +
          (m.params_b ? "<dt>Parameters</dt><dd>" + num(m.params_b) + "B" + (m.params_active_b ? " total / " + num(m.params_active_b) + "B active" : "") + "</dd>" : "") +
          "<dt>Self-host</dt><dd>" + (m.self_host && m.self_host.feasible ? esc(m.self_host.note) : "not possible / not offered") + "</dd>" +
          "<dt>Regions</dt><dd>" + esc((m.residency && m.residency.note) || "not verified") + "</dd>" +
          (m.price && m.price.batch ? "<dt>Batch</dt><dd>" + money(m.price.batch.in) + " in / " + money(m.price.batch.out) + " out</dd>" : "") +
          (m.price && m.price.long_ctx ? "<dt>Long context</dt><dd>" + esc(m.price.long_ctx) + "</dd>" : "") +
          (m.price && m.price.notes ? "<dt>Fine print</dt><dd>" + esc(m.price.notes) + "</dd>" : "") +
          hs +
        "</dl>" +
        '<p style="margin-top:12px;font-size:12.5px">Checked ' + esc((m.price && m.price.verified) || "—") +
        (m.price && m.price.source_url ? ' · <a href="' + esc(m.price.source_url) + '" target="_blank" rel="nofollow noopener">' + esc((m.price && m.price.source_label) || "source") + "</a>" : "") +
        " · <a href=\"" + esc(m.vendor_url) + "\" target=\"_blank\" rel=\"nofollow noopener\">provider</a></p>" +
      "</div>" +
    "</article>";
  }

  function initLibrary() {
    var box = $("#mList");
    if (!box) return;
    var state = { q: "", weights: "all", vendor: "all", tag: "all", sort: "out" };

    function buildFilters() {
      var wc = $("#fWeights"), vc = $("#fVendors"), tc = $("#fTags");
      if (wc) wc.innerHTML = ["all", "open", "closed"].map(function (v) {
        return '<button class="chip' + (v === state.weights ? " on" : "") + '" data-f="weights" data-v="' + v + '">' + (v === "all" ? "Any licence" : v === "open" ? "Open weights" : "Closed") + "</button>";
      }).join("");
      if (vc) vc.innerHTML = ['<button class="chip' + (state.vendor === "all" ? " on" : "") + '" data-f="vendor" data-v="all">Any vendor</button>']
        .concat(vendors().map(function (v) {
          return '<button class="chip' + (state.vendor === v ? " on" : "") + '" data-f="vendor" data-v="' + esc(v) + '">' + esc(v) + "</button>";
        })).join("");
      if (tc) tc.innerHTML = ['<button class="chip' + (state.tag === "all" ? " on" : "") + '" data-f="tag" data-v="all">Any strength</button>']
        .concat(allTags().map(function (t) {
          return '<button class="chip' + (state.tag === t ? " on" : "") + '" data-f="tag" data-v="' + esc(t) + '">' + esc(t) + "</button>";
        })).join("");
    }

    function matches(m) {
      if (state.weights !== "all" && m.weights !== state.weights) return false;
      if (state.vendor !== "all" && m.vendor !== state.vendor) return false;
      if (state.tag !== "all" && (m.tags || []).indexOf(state.tag) < 0) return false;
      if (state.q) {
        var hay = [m.name, m.model_id, m.vendor, m.best_for, (m.tags || []).join(" "), m.license || ""].join(" ").toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) < 0) return false;
      }
      return true;
    }

    function sortList(list) {
      var s = state.sort;
      return list.slice().sort(function (a, b) {
        var pa = effPrice(a), pb = effPrice(b);
        function v(p) { return p.out === null ? Infinity : p.out; }
        if (s === "out") return v(pa) - v(pb);
        if (s === "in") return (pa.in === null ? Infinity : pa.in) - (pb.in === null ? Infinity : pb.in);
        if (s === "context") {
          var ca = parseInt(String(a.context || "0").replace(/[^0-9]/g, ""), 10) || 0;
          var cb = parseInt(String(b.context || "0").replace(/[^0-9]/g, ""), 10) || 0;
          return cb - ca;
        }
        return a.name.localeCompare(b.name);
      });
    }

    function render() {
      var list = sortList(ALL.filter(matches));
      box.innerHTML = list.length ? list.map(rowHTML).join("") :
        '<div class="empty"><p class="empty-h">Nothing matches.</p><p>Loosen a filter, or <button class="linklike" id="mReset" type="button">clear them all</button>.</p></div>';
      var c = $("#mCount");
      if (c) c.textContent = list.length + " of " + ALL.length + " models";
      var r = $("#mReset");
      if (r) r.addEventListener("click", function () {
        state.q = ""; state.weights = "all"; state.vendor = "all"; state.tag = "all";
        var i = $("#mSearch"); if (i) i.value = "";
        buildFilters(); render();
      });
      $$("[data-toggle]", box).forEach(function (b) {
        b.addEventListener("click", function () {
          var d = document.getElementById("d-" + b.getAttribute("data-toggle"));
          if (d) { d.classList.toggle("open"); b.textContent = d.classList.contains("open") ? "Hide details" : "Details & sources"; }
        });
      });
    }

    buildFilters();
    $$(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!b.getAttribute("data-f")) return;
        state[b.getAttribute("data-f")] = b.getAttribute("data-v");
        buildFilters(); render();
      });
    });
    var q = $("#mSearch");
    if (q) q.addEventListener("input", function () { state.q = q.value.trim(); render(); });
    var s = $("#mSort");
    if (s) s.addEventListener("change", function () { state.sort = s.value; render(); });
    render();
  }

  /* ---------------- comparison table ---------------- */
  function initCompare() {
    var tb = $("#cmpBody");
    if (!tb) return;
    var rows = ALL.slice().sort(function (a, b) {
      var pa = effPrice(a).out, pb = effPrice(b).out;
      return (pa === null ? Infinity : pa) - (pb === null ? Infinity : pb);
    });
    tb.innerHTML = rows.map(function (m) {
      var p = effPrice(m);
      return "<tr>" +
        '<td><span class="name-cell">' + esc(m.name) + '</span><span class="sub">' + esc(m.vendor) + "</span></td>" +
        '<td class="num">' + money(p.in) + "</td>" +
        '<td class="num">' + money(p.cached_in) + "</td>" +
        '<td class="num">' + money(p.out) + "</td>" +
        "<td>" + esc(m.context || "—") + "</td>" +
        "<td>" + (m.weights === "open" ? '<span class="tag ok">open</span>' : '<span class="tag">closed</span>') + "</td>" +
        '<td class="muted">' + esc(m.best_for) + "</td>" +
        "</tr>";
    }).join("");
  }

  /* ---------------- pick wizard ---------------- */
  function initPick() {
    var w = $("#wizard");
    if (!w) return;
    var P = S.pick || {};
    var sel = { use: null, constraint: "any", volume: "small" };
    var out = $("#pickOut");

    function opts(list, key) {
      return (list || []).map(function (o) {
        return '<button class="opt" data-k="' + key + '" data-v="' + esc(o.id) + '"><b>' + esc(o.label) + "</b><span>" + esc(o.hint) + "</span></button>";
      }).join("");
    }
    w.innerHTML =
      '<div class="step"><div class="step-q">01 — WHAT ARE YOU BUILDING</div><div class="opts" data-g="use">' + opts(P.useCases, "use") + "</div></div>" +
      '<div class="step"><div class="step-q">02 — WHAT IS NON-NEGOTIABLE</div><div class="opts" data-g="constraint">' + opts(P.constraints, "constraint") + "</div></div>" +
      '<div class="step"><div class="step-q">03 — HOW MUCH ARE YOU SPENDING</div><div class="opts" data-g="volume">' + opts(P.volumes, "volume") + "</div></div>";

    function volumeMix() {
      if (sel.volume === "tiny") return [8, 2];
      if (sel.volume === "mid") return [600, 150];
      if (sel.volume === "big") return [6000, 1500];
      return [60, 15];
    }

    function score(m) {
      var p = effPrice(m);
      var s = 0, why = [];
      var t = m.tags || [];
      if (sel.use === "coding") {
        if (t.indexOf("coding") >= 0) { s += 30; why.push("tagged for coding"); }
        if (m.tools) { s += 8; why.push("tool calling"); }
      } else if (sel.use === "bulk") {
        if (p.out !== null && p.out <= 1.5) { s += 30; why.push("output at " + money(p.out) + "/M"); }
        if (t.indexOf("bulk") >= 0) s += 12;
        if (p.cached_in !== null && p.in !== null && p.cached_in < p.in / 5) { s += 8; why.push("cached input " + money(p.cached_in)); }
      } else if (sel.use === "longdoc") {
        var ctx = parseInt(String(m.context || "0").replace(/[^0-9]/g, ""), 10) || 0;
        if (ctx >= 1000000) { s += 28; why.push("1M context"); }
        else if (ctx >= 200000) s += 14;
        if (p.cached_in !== null && p.cached_in <= 0.1) { s += 10; why.push("cheap re-reads"); }
      } else if (sel.use === "chat") {
        if (p.out !== null && p.out <= 6) { s += 18; why.push("output " + money(p.out) + "/M"); }
        if (t.indexOf("balanced") >= 0) s += 12;
      } else if (sel.use === "multimodal") {
        if ((m.modalities || []).length > 1) { s += 30; why.push((m.modalities || []).join(" + ") + " input"); }
      } else if (sel.use === "agents") {
        if (t.indexOf("agents") >= 0) s += 24;
        if (t.indexOf("frontier") >= 0) s += 10;
        if (m.tools) s += 8;
        if (m.weights === "open") s += 4;
      }
      if (sel.constraint === "open" && m.weights === "open") { s += 22; why.push("open weights"); }
      if (sel.constraint === "eu") {
        if (m.residency && m.residency.eu) { s += 22; why.push("EU region"); }
        if (m.eu_vendor) { s += 16; why.push("EU-based vendor"); }
      }
      if (sel.constraint === "cheap" && p.out !== null) { s += Math.max(0, 26 - p.out * 3); }
      if (sel.constraint === "frontier" && t.indexOf("frontier") >= 0) { s += 22; why.push("frontier tier"); }
      if (sel.volume === "tiny" && p.out !== null) s += Math.max(0, 14 - p.out * 1.2);
      if (sel.volume === "big" && m.weights === "open" && m.self_host && m.self_host.feasible) { s += 14; why.push("worth modelling self-host at this volume"); }
      if (p.out === null) s -= 40;
      if (m.price && m.price.status === "unverified") s -= 12;
      return { s: s, why: why };
    }

    function render() {
      if (!sel.use) {
        out.innerHTML = '<div class="callout">Pick what you are building. Three candidates appear here with the numbers that put them there — no signup, no email.</div>';
        return;
      }
      var mix = volumeMix();
      var ranked = ALL.map(function (m) { var r = score(m); r.m = m; return r; })
        .filter(function (r) { return sel.constraint !== "open" || r.m.weights === "open"; })
        .filter(function (r) { return sel.constraint !== "eu" || (r.m.residency && r.m.residency.eu); })
        .sort(function (a, b) {
          if (b.s !== a.s) return b.s - a.s;
          var oa = effPrice(a.m).out, ob = effPrice(b.m).out;
          return (oa === null ? Infinity : oa) - (ob === null ? Infinity : ob);
        }).slice(0, 3);

      out.innerHTML = ranked.map(function (r, i) {
        var m = r.m, p = effPrice(m);
        var monthly = monthlyCost(m, mix[0], mix[1], 0.35);
        return '<div class="pick-card' + (i === 0 ? " top" : "") + '">' +
          '<div class="pick-rank">' + (i === 0 ? "BEST FIT" : "ALSO CONSIDER") + "</div>" +
          '<div class="pick-name">' + esc(m.name) + " <span class=\"mrow-vendor\">" + esc(m.vendor) + "</span></div>" +
          '<div class="pick-why">' + esc(m.best_for) + (r.why.length ? " — " + esc(r.why.join(", ") + ".") : "") + "</div>" +
          '<div class="pick-nums">' +
            "<div><span>Input</span><b>" + money(p.in) + "</b></div>" +
            "<div><span>Cached</span><b>" + money(p.cached_in) + "</b></div>" +
            "<div><span>Output</span><b>" + money(p.out) + "</b></div>" +
            "<div><span>Est. monthly</span><b>" + (monthly === null ? "unknown" : "$" + num(monthly, 0)) + "</b></div>" +
          "</div>" +
          '<div class="mrow-foot" style="margin-top:14px">' +
            (p.status === "host" && p.via ? "<span>price via " + esc(p.via) + " (host)</span>" : "") +
            '<a href="/models.html#m-' + esc(m.id) + '">Full record →</a>' +
          "</div>" +
        "</div>";
      }).join("") +
      '<p class="asof" style="margin-top:14px">Monthly figures use a representative token mix for the volume you chose. ' +
      'Your mix decides the bill, not the headline price — run your own numbers on the <a href="/cost.html">Cost page</a>.</p>';
    }

    $$(".opt", w).forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-k"), v = b.getAttribute("data-v");
        sel[k] = v;
        $$('.opt[data-k="' + k + '"]', w).forEach(function (o) { o.classList.remove("on"); });
        b.classList.add("on");
        render();
      });
    });
    var defC = $('.opt[data-v="any"]', w), defV = $('.opt[data-v="small"]', w);
    if (defC) defC.classList.add("on");
    if (defV) defV.classList.add("on");
    render();
  }

  /* ---------------- cost maths ---------------- */
  function monthlyCost(m, inTok, outTok, hitRate) {
    var p = effPrice(m);
    if (p.in === null || p.out === null) return null;
    var ci = p.cached_in === null ? p.in : p.cached_in;
    return inTok * (1 - hitRate) * p.in + inTok * hitRate * ci + outTok * p.out;
  }

  function initCost() {
    var f = $("#costForm");
    if (!f) return;
    var sel = $("#cModel");
    var priced = ALL.filter(function (m) { return effPrice(m).out !== null; })
      .sort(function (a, b) { return effPrice(a).out - effPrice(b).out; });
    sel.innerHTML = priced.map(function (m) {
      return '<option value="' + esc(m.id) + '"' + (m.id === "deepseek-v4.1-flash" ? " selected" : "") + ">" + esc(m.name) + " — " + esc(m.vendor) + "</option>";
    }).join("");

    function run() {
      var m = priced.filter(function (x) { return x.id === sel.value; })[0] || priced[0];
      if (!m) return;
      var inTok = parseFloat($("#cIn").value) || 0;
      var outTok = parseFloat($("#cOut").value) || 0;
      var hit = (parseFloat($("#cHit").value) || 0) / 100;
      var batch = $("#cBatch").checked;

      var p = effPrice(m);
      var pi = p.in, po = p.out, pc = p.cached_in === null ? p.in : p.cached_in;
      if (batch && m.price && m.price.batch) {
        pi = m.price.batch.in; po = m.price.batch.out;
        if (m.price.batch.cached_in !== null && m.price.batch.cached_in !== undefined) pc = m.price.batch.cached_in;
      }

      var inputCost = inTok * (1 - hit) * pi + inTok * hit * pc;
      var outputCost = outTok * po;
      var total = inputCost + outputCost;

      $("#cTotal").textContent = "$" + num(total, total < 100 ? 2 : 0);
      $("#cBreak").innerHTML =
        "<li><span>Input — " + num(inTok, 0) + "M tokens, " + Math.round(hit * 100) + "% cached</span><b>$" + num(inputCost, 2) + "</b></li>" +
        "<li><span>Output — " + num(outTok, 0) + "M tokens</span><b>$" + num(outputCost, 2) + "</b></li>" +
        "<li><span>Output share of the bill</span><b>" + (total ? Math.round(outputCost / total * 100) : 0) + "%</b></li>" +
        "<li><span>Blended rate per 1M tokens</span><b>" + ((inTok + outTok) ? money(total / (inTok + outTok)) : "—") + "</b></li>" +
        "<li><span>Projected annual run-rate</span><b>$" + num(total * 12, 0) + "</b></li>";

      var note = $("#cNote");
      if (batch && !(m.price && m.price.batch)) {
        note.innerHTML = "<strong>No batch rate published for this model.</strong> Standard rates shown — do not budget a discount you have not seen on the provider's own page.";
      } else if (p.status === "unknown") {
        note.innerHTML = "<strong>No verified rate for this model.</strong> Nothing is billed because nothing was confirmed.";
      } else if (m.price && m.price.notes) {
        note.innerHTML = esc(m.price.notes);
      } else {
        note.innerHTML = "";
      }

      var cmp = priced.map(function (x) { return { m: x, c: monthlyCost(x, inTok, outTok, hit) }; })
        .filter(function (r) { return r.c !== null; }).sort(function (a, b) { return a.c - b.c; }).slice(0, 6);
      var min = cmp[0] ? cmp[0].c : 0;
      $("#cCmp").innerHTML = cmp.map(function (r) {
        var pct = min ? Math.round((r.c / min - 1) * 100) : 0;
        return "<tr" + (r.m.id === m.id ? ' style="background:var(--surface-3)"' : "") + ">" +
          "<td>" + esc(r.m.name) + "</td>" +
          '<td class="num">$' + num(r.c, r.c < 100 ? 2 : 0) + "</td>" +
          '<td class="num">' + (pct === 0 ? "cheapest" : "+" + pct + "%") + "</td>" +
          "</tr>";
      }).join("");
    }

    ["#cIn", "#cOut", "#cHit", "#cBatch", "#cModel"].forEach(function (s) {
      var el = $(s);
      if (!el) return;
      el.addEventListener("input", run);
      el.addEventListener("change", run);
    });
    run();
  }

  /* ---------------- break-even: API vs owning GPUs ---------------- */
  function initBreakEven() {
    var f = $("#beForm");
    if (!f) return;
    var gsel = $("#beGpu");
    (S.hardware || []).forEach(function (h) {
      var o = document.createElement("option");
      o.value = h.hr; o.textContent = h.gpu + " — " + h.vram + " GB — $" + h.hr + "/hr";
      if (h.gpu.indexOf("H100 SXM") >= 0) o.selected = true;
      gsel.appendChild(o);
    });
    var msel = $("#beModel");
    var priced = ALL.filter(function (m) { return effPrice(m).out !== null; });
    msel.innerHTML = priced.map(function (m) {
      return '<option value="' + esc(m.id) + '"' + (m.id === "deepseek-v4.1-flash" ? " selected" : "") + ">" + esc(m.name) + "</option>";
    }).join("");

    function run() {
      var hr = parseFloat(gsel.value) || 3.49;
      var gpus = parseInt($("#beCount").value, 10) || 1;
      var util = (parseFloat($("#beUtil").value) || 100) / 100;
      var ops = (parseFloat($("#beOps").value) || 0) / 100;
      var m = priced.filter(function (x) { return x.id === msel.value; })[0] || priced[0];
      var p = effPrice(m);
      var ratio = parseFloat($("#beRatio").value) || 4;
      var tps = parseFloat($("#beTps").value) || 40;

      var gpuMonthly = hr * 24 * 30.4 * util * gpus * (1 + ops);
      var blended = p.out === null ? null : ((ratio * p.in) + p.out) / (ratio + 1);
      var breakEven = blended ? gpuMonthly / blended : null;
      var capacity = tps * 3600 * 24 * 30.4 * util * gpus / 1e6;

      $("#beGpuCost").textContent = "$" + num(gpuMonthly, 0);
      $("#beBlended").textContent = blended === null ? "unknown" : money(blended);
      $("#bePoint").textContent = breakEven === null ? "unknown" : num(breakEven, 0) + "M";
      $("#beCap").textContent = num(capacity, 0) + "M";

      var v = $("#beVerdict");
      if (breakEven === null) {
        v.innerHTML = "No published rate for this model, so there is nothing to compare against.";
      } else if (breakEven > capacity) {
        v.innerHTML = "<b>Renting does not pay off on these numbers.</b> You would need about " + num(breakEven, 0) +
          "M tokens/month to justify the GPU spend, but at the throughput you entered this box tops out near " + num(capacity, 0) +
          "M output tokens/month. The API wins — unless your throughput assumption is wrong, and it is the single number most people overestimate.";
      } else {
        v.innerHTML = "<b>Self-hosting crosses over at roughly " + num(breakEven, 0) + "M tokens/month</b> — about " +
          num(breakEven / 30.4, 1) + "M tokens a day. Below that you are paying for idle silicon; above it the GPU bill stops moving while the API bill keeps climbing. " +
          "Capacity is the ceiling: this configuration tops out near " + num(capacity, 0) + "M output tokens/month.";
      }
      var s = $("#beSrc");
      if (s && S.hardware_source) s.innerHTML = 'GPU rates: <a href="' + esc(S.hardware_source.url) + '" target="_blank" rel="nofollow noopener">' + esc(S.hardware_source.label) + "</a>. Throughput is your input, not a measured figure — the whole result swings on it.";
    }

    ["#beCount", "#beUtil", "#beOps", "#beRatio", "#beTps", "#beGpu", "#beModel"].forEach(function (s) {
      var el = $(s);
      if (!el) return;
      el.addEventListener("input", run); el.addEventListener("change", run);
    });
    run();
  }

  /* ---------------- VRAM estimator ---------------- */
  function initVram() {
    var f = $("#vForm");
    if (!f) return;
    var sel = $("#vModel");
    var presets = ALL.filter(function (m) { return m.params_b; });
    sel.innerHTML = '<option value="">— enter parameters manually —</option>' + presets.map(function (m) {
      return '<option value="' + m.params_b + '">' + esc(m.name) + " — " + num(m.params_b) + "B</option>";
    }).join("");
    var fits = null;

    function run() {
      var b = parseFloat($("#vParams").value) || 0;
      var bp = parseFloat($("#vFmt").value) || 1;
      var ctxK = parseFloat($("#vCtx").value) || 0;
      var kvCoef = parseFloat($("#vKv").value) || 4.6e-6;
      var weights = b * bp * 1.15;
      var kv = ctxK * 1000 * b * kvCoef;
      var total = weights + kv + 2;

      $("#vWeights").textContent = num(weights, 1) + " GB";
      $("#vKvOut").textContent = num(kv, 1) + " GB";
      $("#vTotal").textContent = num(total, 1) + " GB";

      fits = (S.hardware || []).filter(function (h) { return h.vram >= total; })
        .sort(function (a, c) { return a.hr - c.hr; })[0];
      var out = $("#vFits");
      if (!b) {
        out.textContent = "Enter a parameter count to size the box.";
      } else if (fits) {
        out.innerHTML = "Fits on <strong>" + esc(fits.gpu) + "</strong> (" + fits.vram + " GB) at $" + fits.hr +
          "/hr rented. Treat " + num(total, 0) + " GB as the floor — real serving needs headroom for batching and activations.";
      } else {
        var big = (S.hardware || []).slice().sort(function (a, c) { return c.vram - a.vram; })[0];
        out.innerHTML = "No single card here holds it. You are into tensor-parallel territory — two or more " + esc(big ? big.gpu : "large cards") +
          ", plus interconnect overhead the estimator above does not model.";
      }

      var box = $("#vCards");
      if (box) {
        box.innerHTML = (S.hardware || []).map(function (h) {
          var ok = h.vram >= total;
          return "<tr" + (ok ? ' style="background:var(--surface-3)"' : "") + "><td>" + esc(h.gpu) + "</td>" +
            '<td class="num">' + h.vram + " GB</td>" +
            '<td class="num">$' + h.hr + "/hr</td>" +
            '<td class="num">$' + num(h.hr * 24 * 30.4, 0) + "/mo</td>" +
            "<td>" + (ok ? '<span class="tag ok">fits</span>' : '<span class="tag">too small</span>') + "</td></tr>";
        }).join("");
      }
    }
    sel.addEventListener("change", function () { if (sel.value) { $("#vParams").value = sel.value; run(); } });
    ["#vParams", "#vFmt", "#vCtx", "#vKv"].forEach(function (s) {
      var el = $(s);
      if (!el) return;
      el.addEventListener("input", run); el.addEventListener("change", run);
    });
    run();
  }

  /* ---------------- content renderers ---------------- */
  function initContent() {
    var c = $("#channels");
    if (c && S.channels) {
      c.innerHTML = S.channels.map(function (ch) {
        return '<article class="card"><h3>' + esc(ch.name) + "</h3>" +
          "<p><strong>Suits:</strong> " + esc(ch.who) + "</p>" +
          "<p><strong>Money:</strong> " + esc(ch.price) + "</p>" +
          "<p><strong>Paperwork:</strong> " + esc(ch.invoice) + "</p>" +
          "<p><strong>What bites:</strong> " + esc(ch.risk) + "</p>" +
          '<p class="mrow-note" style="margin-top:14px"><strong>Check before signing:</strong> ' + esc(ch.watch) + "</p>" +
          '<div class="tag-row" style="margin-top:12px">' + (ch.examples || []).map(function (e) { return '<span class="tag">' + esc(e) + "</span>"; }).join("") + "</div>" +
          "</article>";
      }).join("");
    }

    var ec = $("#entCheck");
    if (ec && S.enterpriseChecklist) {
      ec.innerHTML = S.enterpriseChecklist.map(function (i) {
        return '<li><span class="mark">?</span><div><b>' + esc(i.q) + "</b>" + esc(i.why) + "</div></li>";
      }).join("");
    }

    var en = $("#engines");
    if (en && S.engines) {
      en.innerHTML = S.engines.map(function (e) {
        return "<tr><td><strong>" + esc(e.name) + "</strong></td><td>" + esc(e.best) + "</td><td>" + esc(e.notes) + "</td><td>" + esc(e.ops) + "</td></tr>";
      }).join("");
    }

    var qt = $("#quant");
    if (qt && S.quant) {
      qt.innerHTML = S.quant.map(function (q) {
        return "<tr><td><strong>" + esc(q.fmt) + '</strong></td><td class="num">' + q.bytes.toFixed(2) + " bytes/param</td><td>" + esc(q.note) + "</td></tr>";
      }).join("");
    }

    var hw = $("#hwTable");
    if (hw && S.hardware) {
      hw.innerHTML = S.hardware.map(function (h) {
        return "<tr><td><strong>" + esc(h.gpu) + '</strong></td><td class="num">' + h.vram + " GB</td>" +
          '<td class="num">$' + h.hr + "/hr</td>" +
          '<td class="num">$' + num(h.hr * 24 * 30.4, 0) + "/mo</td>" +
          "<td>" + esc(h.note) + "</td></tr>";
      }).join("");
      var hs = $("#hwSrc");
      if (hs && S.hardware_source) hs.innerHTML = 'Source: <a href="' + esc(S.hardware_source.url) + '" target="_blank" rel="nofollow noopener">' + esc(S.hardware_source.label) + "</a>.";
    }

    var pm = $("#moves");
    if (pm && S.priceMoves) {
      pm.innerHTML = S.priceMoves.map(function (m) {
        return '<article class="mrow"><div class="mrow-top">' +
          '<span class="tag info">' + esc(m.date) + "</span>" +
          '<span class="mrow-name" style="font-size:15px">' + esc(m.what) + "</span>" +
          '</div><p class="mrow-note">' + esc(m.detail) + "</p>" +
          '<div class="mrow-foot"><a href="' + esc(m.source.url) + '" target="_blank" rel="nofollow noopener">' + esc(m.source.label) + " →</a></div></article>";
      }).join("");
    }

    var fq = $("#faqList");
    if (fq && S.faq) {
      fq.innerHTML = S.faq.map(function (i) {
        return "<details><summary>" + esc(i.q) + '</summary><div class="faq-a">' + esc(i.a) + "</div></details>";
      }).join("");
    }
  }

  /* ---------------- go ---------------- */
  initLibrary();
  initCompare();
  initPick();
  initCost();
  initBreakEven();
  initVram();
  initContent();
})();
