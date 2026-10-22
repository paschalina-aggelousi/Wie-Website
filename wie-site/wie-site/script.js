/* ==========================================================================
   IEEE WIE – University of Macedonia
   enhancements.js
     1. Netflix-style carousels (arrows) for Events + News
     2. Sub-team mind map (open/close + connector lines)
   Loaded after script.js, which keeps handling the tabs and the mobile menu.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. CAROUSELS
     Every .scroll-row gets a wrapper with a "previous" and a "next" arrow.
     ------------------------------------------------------------------------ */
  var CHEVRON_LEFT  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>';
  var CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>';

  function makeButton(kind, label, icon) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'carousel-btn carousel-btn--' + kind;
    b.setAttribute('aria-label', label);
    b.innerHTML = icon;
    return b;
  }

  function initCarousel(row) {
    var wrap = document.createElement('div');
    wrap.className = 'carousel';
    row.parentNode.insertBefore(wrap, row);

    var prev = makeButton('prev', 'Scroll back', CHEVRON_LEFT);
    var next = makeButton('next', 'Scroll forward', CHEVRON_RIGHT);
    wrap.appendChild(prev);
    wrap.appendChild(row);
    wrap.appendChild(next);

    function update() {
      var max = row.scrollWidth - row.clientWidth;
      prev.hidden = row.scrollLeft <= 2;
      next.hidden = row.scrollLeft >= max - 2;
    }

    function go(dir) {
      row.scrollBy({
        left: dir * Math.max(row.clientWidth * 0.85, 200),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    if ('ResizeObserver' in window) {
      new ResizeObserver(update).observe(row);
    }

    /* The Events tabs show/hide the rows with the "hidden" attribute:
       hide the arrows together with the row and re-measure when it comes back. */
    new MutationObserver(function () {
      wrap.hidden = row.hidden;
      if (!row.hidden) { row.scrollLeft = 0; update(); }
    }).observe(row, { attributes: true, attributeFilter: ['hidden'] });

    /* Cards added/removed later, or images/fonts finishing loading */
    new MutationObserver(update).observe(row, { childList: true });
    window.addEventListener('load', update);

    wrap.hidden = row.hidden;
    update();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.scroll-row'), initCarousel);


  /* ------------------------------------------------------------------------
     2. SUB-TEAM MIND MAP
     ------------------------------------------------------------------------ */
  var map = document.getElementById('subteam-map');
  if (!map) { return; }

  var svg     = map.querySelector('.mindmap-lines');
  var center  = map.querySelector('.mm-center');
  var nodes   = Array.prototype.slice.call(map.querySelectorAll('.mm-node'));
  var SVG_NS  = 'http://www.w3.org/2000/svg';
  var mobileQuery = window.matchMedia('(max-width: 760px)');

  function drawLines() {
    var m = map.getBoundingClientRect();
    var c = center.getBoundingClientRect();
    var mobile = mobileQuery.matches;

    while (svg.firstChild) { svg.removeChild(svg.firstChild); }

    /* On mobile the lines share one vertical trunk: draw the lowest branch first,
       so the trunk changes colour at each branch instead of showing only the last. */
    (mobile ? nodes.slice().reverse() : nodes).forEach(function (node) {
      var btn   = node.querySelector('.mm-toggle').getBoundingClientRect();
      var nr    = node.getBoundingClientRect();
      var color = getComputedStyle(node).getPropertyValue('--accent').trim() || '#772583';

      /* The line always ends at the middle of the node's title bar,
         so it stays put when the box grows downwards. */
      var ex = nr.left - m.left;
      var ey = btn.top - m.top + btn.height / 2;
      var sx, sy, d;

      if (mobile) {
        sx = c.left - m.left + c.width / 2;
        sy = c.bottom - m.top - 4;
        d = 'M' + sx + ' ' + sy + ' C' + sx + ' ' + ey + ',' + sx + ' ' + ey + ',' + ex + ' ' + ey;
      } else {
        sx = c.right - m.left - 4;
        sy = c.top - m.top + c.height / 2;
        var dx = (ex - sx) * 0.55;
        d = 'M' + sx + ' ' + sy + ' C' + (sx + dx) + ' ' + sy + ',' + (ex - dx) + ' ' + ey + ',' + ex + ' ' + ey;
      }

      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', color);
      svg.appendChild(path);

      var dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', ex);
      dot.setAttribute('cy', ey);
      dot.setAttribute('r', 5);
      dot.setAttribute('fill', color);
      svg.appendChild(dot);
    });
  }

  /* Redraw on every frame while a box is growing/shrinking */
  var rafId = null;
  function animateLines(ms) {
    var end = performance.now() + ms;
    cancelAnimationFrame(rafId);
    (function tick() {
      drawLines();
      if (performance.now() < end) { rafId = requestAnimationFrame(tick); }
    })();
  }

  nodes.forEach(function (node) {
    var btn = node.querySelector('.mm-toggle');
    btn.addEventListener('click', function () {
      var open = !node.classList.contains('is-open');
      node.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      animateLines(reduceMotion ? 50 : 450);
    });
  });

  window.addEventListener('resize', drawLines);
  if (mobileQuery.addEventListener) { mobileQuery.addEventListener('change', drawLines); }
  if ('ResizeObserver' in window) { new ResizeObserver(drawLines).observe(map); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(drawLines); }
  window.addEventListener('load', drawLines);
  drawLines();
})();