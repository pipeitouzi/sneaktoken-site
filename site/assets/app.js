/* ============================================================
   sneaktoken.com — directory rendering + filtering
   ============================================================ */
(function () {
  'use strict';

  var OFFERS = (window.OFFERS || []);
  var CONTENT = window.CONTENT || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function initials(name) {
    var parts = String(name).replace(/[^A-Za-z0-9 &]/g, ' ').trim().split(/\s+/);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function hueOf(name) {
    var h = 0, i;
    for (i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }
  function fmtDate(iso) {
    if (!iso || iso === 'unknown') return 'unknown';
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function isUnknown(v) {
    return v == null || String(v).toLowerCase() === 'unknown' || String(v).trim() === '';
  }
  function renderVal(v) {
    if (isUnknown(v)) return '<span class="unknown">unknown</span>';
    return esc(v);
  }
  function arr(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v.trim()) return v.split(',').map(function (x) { return x.trim(); });
    return [];
  }

  var BADGE_META = {
    'nocard':       { cls: 'badge-nocard',    label: 'No card' },
    'no-card':      { cls: 'badge-nocard',    label: 'No card' },
    'noexpiry':     { cls: 'badge-noexpiry',  label: 'No expiry' },
    'no-expiry':    { cls: 'badge-noexpiry',  label: 'No expiry' },
    'daily':        { cls: 'badge-daily',     label: 'Daily reset' },
    'daily-refresh':{ cls: 'badge-daily',     label: 'Daily reset' },
    'onetime':      { cls: 'badge-onetime',   label: 'One-time' },
    'one-time':     { cls: 'badge-onetime',   label: 'One-time' }
  };
  var CAT_LABEL = {
    'llm': 'LLM API', 'gpu': 'GPU compute', 'embedding': 'Embedding & rerank',
    'speech': 'Speech', 'image': 'Image', 'agent': 'Agent', 'hosting': 'Hosting'
  };

  function badgeMeta(b) {
    return BADGE_META[String(b || '').toLowerCase()] || { cls: 'badge-none', label: esc(b || '—') };
  }
  function catLabel(c) { return CAT_LABEL[String(c).toLowerCase()] || c; }

  /* ---------- normalise ---------- */
  var items = OFFERS.map(function (o, i) {
    var cats = arr(o.category).map(function (c) { return String(c).toLowerCase(); });
    return {
      idx: i,
      id: o.id || 'offer-' + i,
      name: o.name || 'Untitled',
      tagline: o.tagline || '',
      badge: String(o.badge || '').toLowerCase(),
      cats: cats,
      catText: cats.map(catLabel).join(' · ') || '—',
      quota: o.quota,
      limits: o.limits,
      card_required: o.card_required,
      expiry: o.expiry,
      region: o.region || 'Global',
      region_notes: o.region_notes,
      data_training: o.data_training,
      path: o.path,
      code: o.code,
      code_lang: o.code_lang || 'python',
      verdict: o.verdict,
      best_for: arr(o.best_for),
      url: o.url || '#',
      checked: o.checked,
      source: o.source || '',
      confidence: o.confidence || 'unknown',
      notes: o.notes || '',
      featured: o.featured == null ? 999 : o.featured,
      hay: [o.name, o.tagline, o.quota, o.verdict, o.region, arr(o.best_for).join(' '),
            cats.join(' '), o.id, o.notes].join(' ').toLowerCase()
    };
  });

  /* ---------- filters ---------- */
  var state = { q: '', category: new Set(), badge: new Set(), region: new Set(), sort: 'featured' };

  function buildChips() {
    var groups = {
      category: {},
      badge: {},
      region: {}
    };
    items.forEach(function (it) {
      (it.cats.length ? it.cats : []).forEach(function (c) {
        groups.category[c] = (groups.category[c] || 0) + 1;
      });
      if (it.badge) groups.badge[it.badge] = (groups.badge[it.badge] || 0) + 1;
      (arr(it.region).length ? arr(it.region) : [it.region]).forEach(function (r) {
        groups.region[r] = (groups.region[r] || 0) + 1;
      });
    });

    Object.keys(groups).forEach(function (g) {
      var host = $('.chips[data-group="' + g + '"]');
      if (!host) return;
      var entries = Object.keys(groups[g]).sort(function (a, b) {
        if (g === 'badge') return Object.keys(BADGE_META).indexOf(a) - Object.keys(BADGE_META).indexOf(b);
        return groups[g][b] - groups[g][a];
      });
      host.innerHTML = entries.map(function (k) {
        var label = g === 'category' ? catLabel(k)
                  : g === 'badge' ? badgeMeta(k).label
                  : esc(k);
        return '<button type="button" class="chip" data-group="' + g + '" data-val="' + esc(k) +
               '" aria-pressed="false">' + label + '<span class="n">' + groups[g][k] + '</span></button>';
      }).join('');
    });
  }

  function visible() {
    var out = items.filter(function (it) {
      if (state.q && it.hay.indexOf(state.q) === -1) return false;
      if (state.category.size) {
        var hit = false;
        it.cats.forEach(function (c) { if (state.category.has(c)) hit = true; });
        if (!hit) return false;
      }
      if (state.badge.size && !state.badge.has(it.badge)) return false;
      if (state.region.size) {
        var rs = arr(it.region).length ? arr(it.region) : [it.region];
        var rh = false;
        rs.forEach(function (r) { if (state.region.has(r)) rh = true; });
        if (!rh) return false;
      }
      return true;
    });

    if (state.sort === 'name') {
      out.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (state.sort === 'nocard') {
      out.sort(function (a, b) {
        var an = /yes|true|required/i.test(String(a.card_required)) ? 1 : 0;
        var bn = /yes|true|required/i.test(String(b.card_required)) ? 1 : 0;
        return an - bn || a.featured - b.featured;
      });
    } else {
      out.sort(function (a, b) { return a.featured - b.featured || a.name.localeCompare(b.name); });
    }
    return out;
  }

  /* ---------- card ---------- */
  function cardHTML(it) {
    var bm = badgeMeta(it.badge);
    var hue = hueOf(it.name);
    var specs = '';

    specs += '<div class="spec"><div class="spec-k">Quota</div><div class="spec-v">' + renderVal(it.quota) + '</div></div>';
    specs += '<div class="spec"><div class="spec-k">Limits</div><div class="spec-v">' + renderVal(it.limits) + '</div></div>';

    var regionTxt = renderVal(it.region);
    if (!isUnknown(it.region_notes)) {
      regionTxt += ' <span class="flag">' + esc(it.region_notes) + '</span>';
    }
    specs += '<div class="spec"><div class="spec-k">Region</div><div class="spec-v">' + regionTxt + '</div></div>';

    var cardTxt = /^no$/i.test(String(it.card_required).trim()) ? '<strong>No card</strong>'
                : /^yes$/i.test(String(it.card_required).trim()) ? '<strong>Yes</strong>'
                : renderVal(it.card_required);
    specs += '<div class="spec"><div class="spec-k">Card</div><div class="spec-v">' + cardTxt + '</div></div>';

    if (!isUnknown(it.expiry)) {
      specs += '<div class="spec"><div class="spec-k">Expires</div><div class="spec-v">' + renderVal(it.expiry) + '</div></div>';
    }
    if (!isUnknown(it.data_training)) {
      specs += '<div class="spec"><div class="spec-k">Data</div><div class="spec-v">' + renderVal(it.data_training) + '</div></div>';
    }

    var code = '';
    if (!isUnknown(it.path) || !isUnknown(it.code)) {
      code = '<div class="card-code"><div class="code-hd">Quickstart</div>';
      if (!isUnknown(it.path)) code += '<div class="code-path">' + esc(it.path) + '</div>';
      if (!isUnknown(it.code)) {
        code += '<pre class="code"><code>' + esc(it.code) + '</code></pre>';
      }
      code += '</div>';
    }

    var verdict = !isUnknown(it.verdict)
      ? '<p class="card-verdict"><b>Verdict.</b> ' + esc(it.verdict) + '</p>' : '';

    var best = it.best_for.length
      ? '<div class="card-best">' + it.best_for.map(function (b) {
          return '<span class="tag">' + esc(b) + '</span>'; }).join('') + '</div>' : '';

    return '' +
      '<article class="card" id="' + esc(it.id) + '">' +
        '<div class="card-hd">' +
          '<div class="card-top">' +
            '<div class="card-logo" style="background:hsl(' + hue + ',52%,34%)">' + esc(initials(it.name)) + '</div>' +
            '<div class="card-name"><h3>' + esc(it.name) + '</h3>' +
              '<div class="card-cat">' + esc(it.catText) + '</div></div>' +
            '<span class="badge ' + bm.cls + '">' + bm.label + '</span>' +
          '</div>' +
          (it.tagline ? '<p class="card-tagline">' + esc(it.tagline) + '</p>' : '') +
        '</div>' +
        '<div class="card-specs">' + specs + '</div>' +
        code + verdict + best +
        '<div class="card-ft">' +
          '<a class="btn-go" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer nofollow">Get credits →</a>' +
          (it.source
            ? '<a class="card-date card-src" href="' + esc(it.source) + '" target="_blank" rel="noopener" ' +
              'title="Verified against the official page — click to open it">✓ ' + fmtDate(it.checked) + '</a>'
            : '<span class="card-date" title="Last verified">✓ ' + fmtDate(it.checked) + '</span>') +
        '</div>' +
      '</article>';
  }

  /* ---------- compare table ---------- */
  function tableHTML(list) {
    var rows = list.map(function (it) {
      var card = /^no$/i.test(String(it.card_required).trim())
        ? '<span class="yes">No</span>'
        : /^yes$/i.test(String(it.card_required).trim())
          ? '<span class="no">Yes</span>' : renderVal(it.card_required);
      return '<tr>' +
        '<td>' + esc(it.name) + '</td>' +
        '<td>' + renderVal(it.quota) + '</td>' +
        '<td>' + renderVal(it.limits) + '</td>' +
        '<td>' + card + '</td>' +
        '<td>' + renderVal(it.expiry) + '</td>' +
        '<td>' + (it.best_for.length ? esc(it.best_for.slice(0, 2).join(', ')) : '—') + '</td>' +
      '</tr>';
    }).join('');
    $('#cmp tbody').innerHTML = rows || '<tr><td colspan="6">No entries yet.</td></tr>';
  }

  /* ---------- pick + faq ---------- */
  function renderPick() {
    var host = $('#pickGrid');
    if (!host || !CONTENT.picks) return;
    host.innerHTML = CONTENT.picks.map(function (p) {
      return '<div class="pick">' +
        '<span class="pick-tag">' + esc(p.tag || 'Tip') + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.body) + '</p>' +
        '<div class="pick-rec"><b>Start with:</b> ' + esc(p.pick) + '</div>' +
      '</div>';
    }).join('');
  }

  function renderFaq() {
    var host = $('#faqList');
    if (!host || !CONTENT.faq) return;
    host.innerHTML = CONTENT.faq.map(function (f, i) {
      return '<div class="faq-i" data-open="false">' +
        '<button class="faq-q" type="button" aria-expanded="false" aria-controls="fa-' + i + '" id="fq-' + i + '">' +
          '<span>' + esc(f.q) + '</span><span class="faq-ico" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="faq-a" id="fa-' + i + '" role="region" aria-labelledby="fq-' + i + '">' +
          '<div><p>' + esc(f.a) + '</p></div>' +
        '</div></div>';
    }).join('');

    host.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-q');
      if (!btn) return;
      var item = btn.parentElement;
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  /* ---------- meta ---------- */
  function renderMeta() {
    var dates = items.map(function (i) { return i.checked; }).filter(Boolean).sort();
    var latest = dates.length ? dates[dates.length - 1] : '';
    var fmt = latest ? fmtDate(latest) : '—';
    ['#heroDate', '#ftrDate'].forEach(function (s) {
      var el = $(s); if (el) { el.textContent = fmt; el.setAttribute('datetime', latest || ''); }
    });

    var nocard = items.filter(function (i) { return /^no$/i.test(String(i.card_required).trim()); }).length;
    var gpu = items.filter(function (i) { return i.cats.indexOf('gpu') > -1; }).length;
    var forever = items.filter(function (i) { return i.badge === 'noexpiry' || i.badge === 'no-expiry'; }).length;

    var set = function (k, v) {
      var el = document.querySelector('[data-stat="' + k + '"]'); if (el) el.textContent = v;
    };
    set('total', items.length); set('nocard', nocard); set('gpu', gpu); set('forever', forever);
    var hc = $('#heroCount'); if (hc) hc.textContent = items.length;
    var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---------- paint ---------- */
  function paint() {
    var list = visible();
    $('#grid').innerHTML = list.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;

    var bits = [];
    if (state.category.size) bits.push([].concat(Array.from(state.category)).map(catLabel).join(' + '));
    if (state.badge.size) bits.push(Array.from(state.badge).map(function (b) { return badgeMeta(b).label; }).join(' + '));
    if (state.region.size) bits.push(Array.from(state.region).join(' + '));
    if (state.q) bits.push('“' + state.q + '”');

    $('#resultLine').textContent = list.length === items.length
      ? 'Showing all ' + items.length + ' offers.'
      : 'Showing ' + list.length + ' of ' + items.length + ' offers' + (bits.length ? ' · ' + bits.join(' · ') : '');

    var active = state.category.size || state.badge.size || state.region.size || state.q;
    $('#reset').hidden = !active;

    $$('.chip').forEach(function (c) {
      var g = c.dataset.group, v = c.dataset.val;
      c.setAttribute('aria-pressed', state[g].has(v) ? 'true' : 'false');
    });

    tableHTML(list);
  }

  /* ---------- events ---------- */
  function bind() {
    $('#filters').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var g = chip.dataset.group, v = chip.dataset.val;
      if (state[g].has(v)) state[g].delete(v); else state[g].add(v);
      paint();
    });

    var qt;
    $('#q').addEventListener('input', function (e) {
      clearTimeout(qt);
      var v = e.target.value.trim().toLowerCase();
      qt = setTimeout(function () { state.q = v; paint(); }, 130);
    });

    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; paint(); });

    function resetAll() {
      state.category.clear(); state.badge.clear(); state.region.clear();
      state.q = ''; $('#q').value = ''; paint();
    }
    $('#reset').addEventListener('click', resetAll);
    $('#emptyReset').addEventListener('click', resetAll);

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== $('#q')) {
        var t = e.target.tagName;
        if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
        e.preventDefault(); $('#q').focus();
      }
      if (e.key === 'Escape' && document.activeElement === $('#q')) {
        $('#q').value = ''; state.q = ''; paint(); $('#q').blur();
      }
    });

    $('#subForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#subEmail').value.trim();
      var msg = $('#subMsg');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        msg.textContent = 'That email doesn’t look right.';
        msg.classList.remove('ok');
        return;
      }
      msg.textContent = 'Thanks — this is a demo form; connect a mailer to actually collect emails.';
      msg.classList.add('ok');
      $('#subEmail').value = '';
    });

    var contact = $('#ftrContact');
    if (contact && CONTENT.contact) contact.setAttribute('href', CONTENT.contact);
  }

  /* ---------- header shadow ---------- */
  function shadow() {
    var h = $('#hdr');
    var on = function () { h.style.boxShadow = window.scrollY > 4 ? '0 1px 3px rgba(8,8,10,.06)' : 'none'; };
    window.addEventListener('scroll', on, { passive: true }); on();
  }

  /* ---------- init ---------- */
  buildChips();
  renderMeta();
  renderPick();
  renderFaq();
  paint();
  bind();
  shadow();
})();
