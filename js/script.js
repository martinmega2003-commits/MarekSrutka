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
