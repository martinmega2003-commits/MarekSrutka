var toggle = document.querySelector('.nav-toggle');
var nav = document.getElementById('nav');

toggle.addEventListener('click', function () {
  var open = nav.getAttribute('data-open') === 'true';
  nav.setAttribute('data-open', String(!open));
  toggle.setAttribute('aria-expanded', String(!open));
});

nav.addEventListener('click', function (e) {
  if (e.target.closest('a')) {
    nav.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// po přetočení na šířku / zvětšení okna zavřít mobilní menu
window.addEventListener('resize', function () {
  if (window.innerWidth >= 900) {
    nav.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

/* pás referencí: na PC bez trackpadu jinak nejde rozjet — svislý scroll kolečkem myši překlopíme na vodorovný */
(function () {
  var strip = document.querySelector('.ref-strip');
  if (!strip) return;
  strip.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // uživatel už scrolluje vodorovně (trackpad) — nezasahovat
    e.preventDefault();
    strip.scrollLeft += e.deltaY;
  }, { passive: false });
})();

/* ============================================================
   SVÁŘEČSKÁ ŠKOLA — filtr kurzů (jen na svarecska-skola.html)
   ============================================================ */
(function () {
  var listEl = document.getElementById('list');
  if (!listEl) return;

  var KURZY = [
    { typ: 'zaskoleni', kod: 'ZP 81-2 1.1', metoda: '81', nazev: 'Řezání a drážkování kyslíkem', mat: 'Nelegované oceli', t: 20, p: 36 },
    { typ: 'zaskoleni', kod: 'ZP 83-2 1.1', metoda: '83', nazev: 'Řezání plazmou', mat: 'Nelegované oceli', t: 20, p: 36 },
    { typ: 'zaskoleni', kod: 'ZP 311-1 1.1', metoda: '311', nazev: 'Stehování plamenem', mat: 'Nelegované oceli', t: 20, p: 36 },
    { typ: 'zaskoleni', kod: 'ZP 912-9 1.1', metoda: '912', nazev: 'Plamenové tvrdé pájení', mat: 'Měď a slitiny', t: 20, p: 36 },

    { typ: 'zakladni', kod: 'ZK 111 1.1', metoda: '111', nazev: 'Ruční obloukové svařování obalenou elektrodou', mat: 'Nelegované a nízkolegované oceli', t: 40, p: 120 },
    { typ: 'zakladni', kod: 'ZK 111 8', metoda: '111', nazev: 'Ruční obloukové svařování obalenou elektrodou', mat: 'Vysokolegované austenitické oceli', t: 40, p: 120 },
    { typ: 'zakladni', kod: 'ZK 135 1.1', metoda: '135', nazev: 'Svařování tavící se elektrodou v aktivním plynu', mat: 'Nelegované oceli bez předehřevu', t: 40, p: 96 },
    { typ: 'zakladni', kod: 'ZK 141 1.1', metoda: '141', nazev: 'Svařování netavící se elektrodou v inertním plynu', mat: 'Nelegované a nízkolegované oceli', t: 40, p: 96 },
    { typ: 'zakladni', kod: 'ZK 141 8', metoda: '141', nazev: 'Svařování netavící se elektrodou v inertním plynu', mat: 'Vysokolegované austenitické oceli', t: 40, p: 96 },
    { typ: 'zakladni', kod: 'ZK 131 21', metoda: '131', nazev: 'Svařování tavící se elektrodou v inertním plynu', mat: 'Hliník a jeho slitiny', t: 40, p: 96 },
    { typ: 'zakladni', kod: 'ZK 311 1.1', metoda: '311', nazev: 'Svařování kyslíko-acetylenovým plamenem', mat: 'Nelegované oceli bez předehřevu', t: 40, p: 120 },
    { typ: 'zakladni', kod: 'ZK 912 31', metoda: '912', nazev: 'Měkké a tvrdé pájení plamenem', mat: 'Měď a její slitiny', t: 40, p: 64 },

    { typ: 'uredni', kod: '111', metoda: '111', nazev: 'Ruční obloukové svařování obalenou elektrodou', mat: 'Materiál 1.1, 1.2, 1.3, 6 — ČSN EN ISO 9606-1', t: 32, p: 128 },
    { typ: 'uredni', kod: '111', metoda: '111', nazev: 'Ruční obloukové svařování obalenou elektrodou', mat: 'Materiál 8 — ČSN EN ISO 9606-1', t: 32, p: 128 },
    { typ: 'uredni', kod: '311', metoda: '311', nazev: 'Svařování kyslíko-acetylenovým plamenem', mat: 'Materiál 1.1, 1.2, 6 — ČSN EN ISO 9606-1', t: 32, p: 128 },
    { typ: 'uredni', kod: '135', metoda: '135', nazev: 'Svařování tavící se elektrodou v aktivním plynu', mat: 'Materiál 1.1, 1.2, 1.3, 6 — ČSN EN ISO 9606-1', t: 32, p: 128 },
    { typ: 'uredni', kod: '135', metoda: '135', nazev: 'Svařování tavící se elektrodou v aktivním plynu', mat: 'Materiál 8, 21, 22, 23 — 9606-1 a 9606-2', t: 32, p: 128 },
    { typ: 'uredni', kod: '131', metoda: '131', nazev: 'Svařování tavící se elektrodou v inertním plynu', mat: 'Materiál 8, 21, 22, 23 — 9606-1 a 9606-2', t: 32, p: 128 },
    { typ: 'uredni', kod: '141', metoda: '141', nazev: 'Svařování netavící se elektrodou v inertním plynu', mat: 'Materiál 1.1, 1.2, 1.3 — ČSN EN ISO 9606-1', t: 32, p: 128 },
    { typ: 'uredni', kod: '141', metoda: '141', nazev: 'Svařování netavící se elektrodou v inertním plynu', mat: 'Materiál 8, 21, 22, 31 — 9606-1 a 9606-2', t: 32, p: 128 },
    { typ: 'uredni', kod: '912', metoda: '912', nazev: 'Pájení mědi a jejích slitin', mat: 'Materiál 31 — ČSN 050710, ČSN EN ISO 13585', t: 32, p: 48 },

    { typ: 'periodicka', kod: '111 · 311 · 135 · 141', metoda: '111,311,135,141', nazev: 'Periodická úřední zkouška, nelegované oceli', mat: 'Materiál 1.1, 1.2, 1.3, 6', t: 8, p: 16 },
    { typ: 'periodicka', kod: '111 · 131 · 135 · 141', metoda: '111,131,135,141', nazev: 'Periodická úřední zkouška, vysokolegované oceli a neželezné kovy', mat: 'Materiál 8, 21, 22, 31', t: 8, p: 16 },
    { typ: 'periodicka', kod: '912', metoda: '912', nazev: 'Periodická zkouška, pájení mědi', mat: 'Materiál 31', t: 8, p: 16 }
  ];

  var TYPY = [
    { id: 'vse', label: 'Vše' },
    { id: 'zaskoleni', label: 'Zaškolení' },
    { id: 'zakladni', label: 'Základní kurz' },
    { id: 'uredni', label: 'Úřední zkouška' },
    { id: 'periodicka', label: 'Periodická zkouška' }
  ];
  var NAZVY_TYPU = {
    zaskoleni: 'Zaškolení', zakladni: 'Základní kurz',
    uredni: 'Úřední zkouška', periodicka: 'Periodická zkouška'
  };
  var METODY = ['vse', '111', '131', '135', '141', '311', '912', '81', '83'];
  var METODY_POPIS = {
    111: 'ruční obloukem (elektroda)',
    131: 'MIG (tavící se elektroda, inertní plyn)',
    135: 'MAG (tavící se elektroda, aktivní plyn)',
    141: 'TIG (netavící se elektroda)',
    311: 'plamenem (kyslík-acetylen)',
    912: 'pájení plamenem',
    81: 'řezání kyslíkem',
    83: 'řezání plazmou'
  };

  var stavTyp = 'vse', stavMetoda = 'vse';

  function chip(text, aktivni, popis) {
    var b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.textContent = text;
    b.setAttribute('aria-pressed', aktivni ? 'true' : 'false');
    if (popis) b.title = popis;
    return b;
  }

  function vykresliFiltry() {
    var wt = document.getElementById('typy');
    var wm = document.getElementById('metody');
    wt.innerHTML = ''; wm.innerHTML = '';

    TYPY.forEach(function (t) {
      var b = chip(t.label, stavTyp === t.id);
      b.onclick = function () { stavTyp = t.id; vykresli(); };
      wt.appendChild(b);
    });

    METODY.forEach(function (m) {
      var b = chip(m === 'vse' ? 'Všechny' : m, stavMetoda === m, METODY_POPIS[m]);
      b.onclick = function () { stavMetoda = m; vykresli(); };
      wm.appendChild(b);
    });
  }

  function skloneni(n) {
    if (n === 1) return '1 kurz';
    if (n >= 2 && n <= 4) return n + ' kurzy';
    return n + ' kurzů';
  }

  function vykresli() {
    vykresliFiltry();

    var vysledky = KURZY.filter(function (k) {
      var okTyp = stavTyp === 'vse' || k.typ === stavTyp;
      var okMet = stavMetoda === 'vse' || k.metoda.split(',').indexOf(stavMetoda) !== -1;
      return okTyp && okMet;
    });

    document.getElementById('count').textContent = skloneni(vysledky.length);

    listEl.innerHTML = '';

    if (!vysledky.length) {
      var d = document.createElement('p');
      d.className = 'course-empty';
      d.textContent = 'Této kombinaci nic neodpovídá. Zkuste jinou metodu, nebo zavolejte a domluvíme se.';
      listEl.appendChild(d);
      return;
    }

    vysledky.forEach(function (k) {
      var el = document.createElement('article');
      el.className = 'course';
      el.innerHTML =
        '<div class="c-code">' + k.kod + '</div>' +
        '<div>' +
          '<div class="c-name">' + k.nazev + '</div>' +
          '<span class="c-mat">' + k.mat + '</span>' +
        '</div>' +
        '<div class="c-meta">' +
          '<span class="c-h">teorie <b>' + k.t + ' h</b></span>' +
          '<span class="c-h">praxe <b>' + k.p + ' h</b></span>' +
          '<span class="badge">' + NAZVY_TYPU[k.typ] + '</span>' +
        '</div>';
      listEl.appendChild(el);
    });
  }

  document.getElementById('reset').onclick = function () {
    stavTyp = 'vse'; stavMetoda = 'vse'; vykresli();
  };

  vykresli();
})();

/* ============================================================
   KÓTOVÁNÍ — sdílený hover efekt technického výkresu
   (používá menu i tlačítka .btn-kota)
   ============================================================ */
var Kota = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var GAP = 10;          // odstup kótovací čáry od položky
  var TICK = 6;           // délka koncové značky
  var EASE_STR = 'cubic-bezier(.22,.9,.3,1)';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function svgEl(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // ---- cubic-bezier(.22,.9,.3,1) easing pro JS tween ----
  function makeBezierEase(x1, y1, x2, y2) {
    function A(a1, a2) { return 1 - 3 * a2 + 3 * a1; }
    function B(a1, a2) { return 3 * a2 - 6 * a1; }
    function C(a1) { return 3 * a1; }
    function calc(t, a1, a2) { return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t; }
    function slope(t, a1, a2) { return 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1); }
    return function (x) {
      var t = x;
      for (var i = 0; i < 6; i++) {
        var s = slope(t, x1, x2);
        if (s === 0) break;
        t -= (calc(t, x1, x2) - x) / s;
      }
      return calc(t, y1, y2);
    };
  }
  var EASE = makeBezierEase(.22, .9, .3, 1);

  function len(el) {
    if (el.tagName === 'rect') {
      var w = parseFloat(el.getAttribute('width')) || 0;
      var h = parseFloat(el.getAttribute('height')) || 0;
      return 2 * (w + h);
    }
    var x1 = parseFloat(el.getAttribute('x1')) || 0;
    var y1 = parseFloat(el.getAttribute('y1')) || 0;
    var x2 = parseFloat(el.getAttribute('x2')) || 0;
    var y2 = parseFloat(el.getAttribute('y2')) || 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  // Vytvoří jednu sadu kótovacích tvarů uvnitř daného <svg> a vrátí ovládací API.
  function createBox(svg, color) {
    var outline = svgEl('rect', { fill: 'none', stroke: color, 'stroke-width': 1 });
    var tickW1 = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var tickW2 = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var lineW = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var tickH1 = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var tickH2 = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var lineH = svgEl('line', { stroke: color, 'stroke-width': 1 });
    var labelWText = svgEl('text', { class: 'dim-label-text', fill: color, 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
    var labelHText = svgEl('text', { class: 'dim-label-text', fill: color, 'text-anchor': 'start', 'dominant-baseline': 'middle' });

    var drawEls = [outline, tickW1, tickW2, tickH1, tickH2, lineW, lineH];
    drawEls.concat([labelWText, labelHText]).forEach(function (n) { svg.appendChild(n); });

    var currentRect = null;
    var moveGen = 0;

    function setLabel(textEl, x, y, value) {
      textEl.textContent = String(Math.round(value));
      textEl.setAttribute('x', x);
      textEl.setAttribute('y', y);
    }

    function layout(r) {
      outline.setAttribute('x', r.x);
      outline.setAttribute('y', r.y);
      outline.setAttribute('width', r.w);
      outline.setAttribute('height', r.h);

      var wy = r.y + r.h + GAP;
      tickW1.setAttribute('x1', r.x); tickW1.setAttribute('x2', r.x);
      tickW1.setAttribute('y1', wy - TICK / 2); tickW1.setAttribute('y2', wy + TICK / 2);
      tickW2.setAttribute('x1', r.x + r.w); tickW2.setAttribute('x2', r.x + r.w);
      tickW2.setAttribute('y1', wy - TICK / 2); tickW2.setAttribute('y2', wy + TICK / 2);
      lineW.setAttribute('x1', r.x); lineW.setAttribute('x2', r.x + r.w);
      lineW.setAttribute('y1', wy); lineW.setAttribute('y2', wy);

      var hx = r.x + r.w + GAP;
      tickH1.setAttribute('y1', r.y); tickH1.setAttribute('y2', r.y);
      tickH1.setAttribute('x1', hx - TICK / 2); tickH1.setAttribute('x2', hx + TICK / 2);
      tickH2.setAttribute('y1', r.y + r.h); tickH2.setAttribute('y2', r.y + r.h);
      tickH2.setAttribute('x1', hx - TICK / 2); tickH2.setAttribute('x2', hx + TICK / 2);
      lineH.setAttribute('x1', hx); lineH.setAttribute('x2', hx);
      lineH.setAttribute('y1', r.y); lineH.setAttribute('y2', r.y + r.h);

      setLabel(labelWText, r.x + r.w / 2, wy + 14, r.w);
      setLabel(labelHText, hx + 5, r.y + r.h / 2, r.h);
    }

    function refreshDash() {
      drawEls.forEach(function (e) {
        e.style.transition = 'none';
        e.setAttribute('stroke-dasharray', len(e));
        e.setAttribute('stroke-dashoffset', 0);
      });
    }

    function prepDraw(el) {
      var l = len(el);
      el.style.transition = 'none';
      el.setAttribute('stroke-dasharray', l);
      el.setAttribute('stroke-dashoffset', l);
    }

    function playDraw(el, duration, delay) {
      el.getBoundingClientRect(); // vynutit reflow, jinak se animace nespustí
      el.style.transition = 'stroke-dashoffset ' + duration + 'ms ' + EASE_STR + ' ' + delay + 'ms';
      el.setAttribute('stroke-dashoffset', 0);
    }

    function showInstant(r) {
      currentRect = r;
      layout(r);
      refreshDash();
      labelWText.style.transition = 'none';
      labelHText.style.transition = 'none';
      labelWText.style.opacity = 1;
      labelHText.style.opacity = 1;
      svg.style.transition = 'none';
      svg.style.opacity = 1;
    }

    function drawIn(r) {
      currentRect = r;
      layout(r);
      svg.style.transition = 'none';
      svg.style.opacity = 1;

      prepDraw(outline);
      [tickW1, tickW2, tickH1, tickH2, lineW, lineH].forEach(prepDraw);
      labelWText.style.transition = 'none';
      labelHText.style.transition = 'none';
      labelWText.style.opacity = 0;
      labelHText.style.opacity = 0;

      svg.getBoundingClientRect(); // vynutit reflow před spuštěním animace

      playDraw(outline, 260, 0);
      playDraw(tickW1, 120, 170);
      playDraw(tickW2, 120, 170);
      playDraw(tickH1, 120, 170);
      playDraw(tickH2, 120, 170);
      playDraw(lineW, 280, 170);
      playDraw(lineH, 280, 170);

      window.setTimeout(function () {
        labelWText.style.transition = 'opacity 180ms ' + EASE_STR;
        labelHText.style.transition = 'opacity 180ms ' + EASE_STR;
        labelWText.style.opacity = 1;
        labelHText.style.opacity = 1;
      }, 400);
    }

    function moveTo(target) {
      var gen = ++moveGen;
      var from = currentRect || target;
      var start = null;
      function frame(ts) {
        if (gen !== moveGen) return;
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / 280);
        var et = EASE(t);
        var r = {
          x: from.x + (target.x - from.x) * et,
          y: from.y + (target.y - from.y) * et,
          w: from.w + (target.w - from.w) * et,
          h: from.h + (target.h - from.h) * et
        };
        currentRect = r;
        layout(r);
        refreshDash();
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function hide() {
      svg.style.transition = 'opacity 150ms ease';
      svg.style.opacity = 0;
    }

    return {
      reduced: reduced,
      drawIn: drawIn,
      showInstant: showInstant,
      moveTo: moveTo,
      hide: hide,
      hasRect: function () { return currentRect !== null; }
    };
  }

  function syncViewBox(svg, containerEl) {
    var r = containerEl.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
    svg.setAttribute('width', r.width);
    svg.setAttribute('height', r.height);
    return r;
  }

  function rectFor(el, containerRect) {
    var r = el.getBoundingClientRect();
    return { x: r.left - containerRect.left, y: r.top - containerRect.top, w: r.width, h: r.height };
  }

  return { createBox: createBox, syncViewBox: syncViewBox, rectFor: rectFor };
})();

/* ---- menu: víc položek ve společném overlay, s přechodem mezi nimi ---- */
(function () {
  var navEl = document.getElementById('nav');
  var svg = navEl && navEl.querySelector('.nav-dim');
  if (!navEl || !svg) return;

  var box = Kota.createBox(svg, '#ee7620');
  var current = null;
  var visible = false;

  function activate(a) {
    if (!a || a === current) return;
    var navRect = Kota.syncViewBox(svg, navEl);
    var r = Kota.rectFor(a, navRect);
    current = a;

    if (box.reduced) {
      visible = true;
      box.showInstant(r);
      return;
    }

    if (visible) {
      box.moveTo(r);
    } else {
      visible = true;
      box.drawIn(r);
    }
  }

  function hide() {
    box.hide();
    visible = false;
    current = null;
  }

  // efekt dává smysl jen na vodorovném desktopovém menu (≥900px)
  var mq900 = window.matchMedia('(min-width: 900px)');

  // ---- delegace přes mousemove + closest(), debounce ~60 ms ----
  var moveTimer = null;
  navEl.addEventListener('mousemove', function (e) {
    if (!mq900.matches) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a || !navEl.contains(a) || a === current) return;
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(function () { activate(a); }, 60);
  });

  navEl.addEventListener('mouseleave', function () {
    window.clearTimeout(moveTimer);
    hide();
  });

  // ---- dotyková zařízení: spustit na tap ----
  navEl.addEventListener('touchstart', function (e) {
    if (!mq900.matches) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    activate(a);
  }, { passive: true });

  // ---- resize: overlay musí přežít změnu velikosti okna ----
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (!mq900.matches) { hide(); return; }
      var navRect = Kota.syncViewBox(svg, navEl);
      if (current) box.moveTo(Kota.rectFor(current, navRect));
    }, 100);
  });

  Kota.syncViewBox(svg, navEl);
})();

/* ---- tlačítka .btn-kota: jedno tlačítko = vlastní nezávislý overlay ---- */
document.querySelectorAll('.btn-kota').forEach(function (btn) {
  var svg = btn.querySelector('.btn-dim');
  if (!svg) return;

  var box = Kota.createBox(svg, '#ee7620');
  var visible = false;

  function show() {
    var r = Kota.syncViewBox(svg, btn);
    var rect = { x: 0, y: 0, w: r.width, h: r.height };
    if (box.reduced) { box.showInstant(rect); }
    else { box.drawIn(rect); }
    visible = true;
  }
  function hide() {
    box.hide();
    visible = false;
  }

  btn.addEventListener('mouseenter', show);
  btn.addEventListener('mouseleave', hide);
  btn.addEventListener('focus', show);
  btn.addEventListener('blur', hide);
  btn.addEventListener('touchstart', function () {
    if (visible) return;
    show();
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (visible) Kota.syncViewBox(svg, btn);
  });
});
