/* ============================================================
   Clay Stan — shared logo + tab-attention module
   - Dot-matrix CLAY STAN logo (inline SVG, theme-aware)
   - Favicon swap + soft "drop" sound when tab loses focus
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 5×7 LED-style letter patterns ---------- */
  var PATTERNS = {
    'C': ['01111','10000','10000','10000','10000','10000','01111'],
    'L': ['10000','10000','10000','10000','10000','10000','11111'],
    'A': ['01110','10001','10001','11111','10001','10001','10001'],
    'Y': ['10001','10001','01010','00100','00100','00100','00100'],
    'S': ['01111','10000','10000','01110','00001','00001','11110'],
    'T': ['11111','00100','00100','00100','00100','00100','00100'],
    'N': ['10001','11001','10101','10101','10101','10011','10001'],
    ' ': ['00000','00000','00000','00000','00000','00000','00000']
  };

  /* ---------- Build dotted-text SVG ---------- */
  function buildDotLogo(rows, opts) {
    opts = opts || {};
    var cellSize = opts.cellSize || 10;
    var dotR = opts.dotR != null ? opts.dotR : 4;
    var letterGap = opts.letterGap != null ? opts.letterGap : 1; // cells
    var lineGap = opts.lineGap != null ? opts.lineGap : 1; // cells

    var maxCols = 0;
    rows.forEach(function (r) {
      var c = r.text.length * 5 + Math.max(0, r.text.length - 1) * letterGap;
      if (c > maxCols) maxCols = c;
    });
    var totalRows = rows.length * 7 + (rows.length - 1) * lineGap;
    var w = maxCols * cellSize;
    var h = totalRows * cellSize;

    var circles = '';
    rows.forEach(function (row, ri) {
      var yBase = ri * (7 + lineGap);
      var lineCols = row.text.length * 5 + Math.max(0, row.text.length - 1) * letterGap;
      var xOffset = (maxCols - lineCols) / 2; // center each row

      var chars = row.text.toUpperCase().split('');
      chars.forEach(function (ch, ci) {
        var xBase = xOffset + ci * (5 + letterGap);
        var pat = PATTERNS[ch];
        if (!pat) return;
        pat.forEach(function (line, lr) {
          line.split('').forEach(function (bit, lc) {
            if (bit === '1') {
              var cx = (xBase + lc) * cellSize + cellSize / 2;
              var cy = (yBase + lr) * cellSize + cellSize / 2;
              // Stagger delay = horizontal position (creates wave-in)
              var delay = (cx / w * 0.9).toFixed(2);
              circles += '<circle cx="' + cx + '" cy="' + cy + '" r="' + dotR
                       + '" fill="' + row.color + '" style="--d:' + delay + 's"/>';
            }
          });
        });
      });
    });

    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" '
         + 'preserveAspectRatio="xMidYMid meet" class="dot-svg" aria-label="Clay Stan">'
         + circles + '</svg>';
  }

  /* ---------- Inject into [data-dotlogo] placeholders ---------- */
  function injectLogos() {
    var nodes = document.querySelectorAll('[data-dotlogo]');
    nodes.forEach(function (el) {
      var variant = el.getAttribute('data-dotlogo') || 'default';
      var rows;
      if (variant === 'mark') {
        rows = [{ text: 'CS', color: 'var(--accent, #FF5A1F)' }];
      } else if (variant === 'inverse' || variant === 'invert') {
        // White CLAY + orange STAN — for dark backgrounds (footer)
        rows = [
          { text: 'CLAY', color: '#ffffff' },
          { text: 'STAN', color: 'var(--accent, #FF5A1F)' }
        ];
      } else {
        // Default: ink CLAY + orange STAN — for light backgrounds
        rows = [
          { text: 'CLAY', color: '#0F0F10' },
          { text: 'STAN', color: 'var(--accent, #FF5A1F)' }
        ];
      }
      el.innerHTML = buildDotLogo(rows);
    });

    // Reveal-on-scroll: stagger wave-in
    var dotSvgs = document.querySelectorAll('.dot-svg');
    if (!dotSvgs.length || !('IntersectionObserver' in window)) {
      dotSvgs.forEach(function (s) { s.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    dotSvgs.forEach(function (s) { io.observe(s); });
  }

  /* ============================================================
     Tab-attention system
     ============================================================ */

  // Favicon -- normal: read the existing favicon path from the page so this script
  // works whether it's loaded from the homepage or a /case-studies/ subpage.
  var FAV_NORMAL = (function () {
    var l = document.querySelector("link[rel='icon']");
    return (l && l.getAttribute('href')) || 'logos/clay-stan-light.png';
  })();

  // Favicon — alert: dotted C shrunk + red "1" notification badge
  var FAV_ALERT =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    + "%3Crect width='32' height='32' rx='7' fill='%230F0F10'/%3E"
    + "%3Ccircle cx='10' cy='11' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='14' cy='11' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='18' cy='11' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='8' cy='15' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='8' cy='19' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='8' cy='23' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='10' cy='26' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='14' cy='26' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='18' cy='26' r='1.5' fill='%23FF5A1F'/%3E"
    + "%3Ccircle cx='24' cy='8' r='7' fill='%23E11D48'/%3E"
    + "%3Ctext x='24' y='11.5' font-family='Inter,sans-serif' font-size='10' font-weight='800' fill='%23ffffff' text-anchor='middle'%3E1%3C/text%3E"
    + "%3C/svg%3E";

  var titleNormal = document.title;
  var titleAlert = '(1) ' + titleNormal;
  var blinkTimer = null;
  var blinkOn = false;
  var audioCtx = null;

  function getIconLink() {
    var link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    return link;
  }

  // Initialize / resume AudioContext on first user interaction (browser autoplay policy)
  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll'].forEach(function (ev) {
    window.addEventListener(ev, ensureAudio, { passive: true });
  });

  // Soft 2-tone "water drop" — generated via Web Audio so no asset needed
  function playDrop() {
    if (!audioCtx) return;
    try {
      var t = audioCtx.currentTime;
      var osc1 = audioCtx.createOscillator();
      var osc2 = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      // Main pluck: bright down-sweep
      osc1.frequency.setValueAtTime(1180, t);
      osc1.frequency.exponentialRampToValueAtTime(360, t + 0.32);
      // Subtle harmonic an octave below for warmth
      osc2.frequency.setValueAtTime(590, t);
      osc2.frequency.exponentialRampToValueAtTime(180, t + 0.32);
      // Very gentle envelope: ~6% peak, fast decay
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.55);
      osc2.stop(t + 0.55);
    } catch (e) { /* swallow */ }
  }

  function startAlert() {
    document.title = titleAlert;
    playDrop();
    if (blinkTimer) clearInterval(blinkTimer);
    blinkOn = true;
    var link = getIconLink();
    link.setAttribute('href', FAV_ALERT);
    blinkTimer = setInterval(function () {
      blinkOn = !blinkOn;
      link.setAttribute('href', blinkOn ? FAV_ALERT : FAV_NORMAL);
    }, 700);
  }

  function stopAlert() {
    if (blinkTimer) { clearInterval(blinkTimer); blinkTimer = null; }
    var link = getIconLink();
    link.setAttribute('href', FAV_NORMAL);
    document.title = titleNormal;
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') startAlert();
    else stopAlert();
  });

  // Set baseline favicon as soon as script runs (overrides any HTML default)
  getIconLink().setAttribute('href', FAV_NORMAL);

  // Inject logos when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLogos);
  } else {
    injectLogos();
  }

  // Expose for debug / programmatic use
  window.ClayStan = {
    buildDotLogo: buildDotLogo,
    injectLogos: injectLogos,
    playDrop: playDrop,
    FAV_NORMAL: FAV_NORMAL,
    FAV_ALERT: FAV_ALERT
  };
})();
