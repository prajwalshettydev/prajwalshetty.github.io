// /hi easter egg: a Bengaluru auto-rickshaw (from Nande Kano Bengaluru) drives along a road at the bottom of the page.
// Scrolling drives it, the meter runs at Bengaluru fares, tapping it honks, and it parks at the NKB stop at the end.
(function () {
  'use strict';
  if (window.__autoRide) return; window.__autoRide = true;

  var GAME_URL = 'https://muddyterrain.com/bengaluru';
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  var css = '' +
  ':root{--road-h:64px}' +
  '@media (max-width:600px){:root{--road-h:54px}}' +
  'body.has-road{padding-bottom:calc(var(--road-h) + 14px)}' +
  '.road{position:fixed;left:0;right:0;bottom:0;height:var(--road-h);z-index:40;pointer-events:none;' +
    'background:#2f3238;box-shadow:0 -6px 18px #1b1f2a26;transition:transform .35s ease}' +
  '.road.off{transform:translateY(110%)}' +
  '.road::before{content:"";position:absolute;left:0;right:0;top:-6px;height:6px;' +
    'background:repeating-linear-gradient(90deg,#ffd84d 0 22px,#17191d 22px 44px)}' +
  '.lane{position:absolute;left:-56px;right:-56px;top:50%;height:3px;margin-top:3px;opacity:.75;will-change:transform;' +
    'background:repeating-linear-gradient(90deg,#f3efe6 0 26px,transparent 26px 56px)}' +
  '.auto{position:absolute;bottom:4px;left:36px;width:132px;height:86px;pointer-events:auto;cursor:pointer;border:0;padding:0;background:none;' +
    '-webkit-tap-highlight-color:transparent;will-change:transform}' +
  '@media (max-width:600px){.auto{width:92px;height:60px}}' +
  '.auto svg{width:100%;height:100%;display:block;overflow:visible}' +
  '.auto:focus-visible{outline:2px solid #ffd84d;outline-offset:4px;border-radius:8px}' +
  '.auto .body{transform-origin:60% 85%}' +
  '.meter{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);white-space:nowrap;' +
    'font:700 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace;color:#ff5b4d;background:#141414;border:2px solid #3a3a3a;' +
    'border-radius:5px;padding:4px 7px;letter-spacing:.06em;box-shadow:0 2px 6px #0005;text-shadow:0 0 6px #ff5b4d88}' +
  '.meter small{color:#9aa0a6;font-weight:600;margin-left:6px;text-shadow:none;letter-spacing:0}' +
  '.bubble{position:absolute;bottom:calc(100% + 34px);left:calc(50% + var(--shift,0px));transform:translateX(-50%) scale(.9);opacity:0;pointer-events:none;' +
    'width:max-content;max-width:min(260px,70vw);background:#fff;color:#17191d;border:1px solid #e3ddd2;border-radius:14px;' +
    'padding:9px 12px;font:600 14px/1.35 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
    'box-shadow:0 10px 26px #1b1f2a2e;transition:opacity .2s ease,transform .2s ease;text-align:left}' +
  '.bubble.on{opacity:1;transform:translateX(-50%) scale(1);pointer-events:auto}' +
  '.bubble::after{content:"";position:absolute;top:100%;left:calc(50% - var(--shift,0px));margin-left:-7px;border:7px solid transparent;border-top-color:#fff}' +
  '.bubble em{display:block;font-style:normal;font-weight:500;font-size:12.5px;color:#5f6672;margin-top:2px}' +
  '.bubble a{display:inline-block;margin-top:6px;font-size:13px;font-weight:700;color:#17191d;background:#ffd84d;border-radius:999px;padding:3px 10px;text-decoration:none}' +
  '.auto::before,.auto::after{content:"";position:absolute;left:-2px;bottom:12%;width:8px;height:8px;border-radius:50%;pointer-events:none;' +
    'background:radial-gradient(circle,#d9d4cacc 0,#d9d4ca00 70%);opacity:0;animation:puff 1.6s ease-out infinite}' +
  '.auto::after{animation-delay:.8s}' +
  '.auto.moving::before,.auto.moving::after{animation-duration:.55s}' +
  '.auto.back::before,.auto.back::after{left:auto;right:-2px;--dx:22px}' +
  '@keyframes puff{0%{opacity:.9;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx,-22px),-14px) scale(3.2)}}' +
  '.auto.idle svg{animation:idle .12s steps(2) infinite}' +
  '@keyframes idle{0%{translate:0 -.4px}100%{translate:0 .4px}}' +
  '.stop{position:absolute;right:14px;bottom:8px;pointer-events:auto;display:flex;align-items:flex-end;gap:0;text-decoration:none}' +
  '.stop .pole{width:4px;height:calc(var(--road-h) + 10px);background:#9aa0a6;border-radius:2px}' +
  '.stop .sign{position:absolute;right:-6px;bottom:calc(var(--road-h) - 6px);background:#ffd84d;color:#17191d;border:2px solid #17191d;' +
    'border-radius:7px;padding:3px 8px;font:800 11px/1.15 ui-sans-serif,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;' +
    'white-space:nowrap;box-shadow:0 3px 0 #17191d}' +
  '.stop .sign b{display:block;font-size:9px;letter-spacing:.12em;opacity:.7}' +
  '.stop:hover .sign,.stop:focus-visible .sign{transform:translateY(-2px)}' +
  '.stop .short{display:none}' +
  '@media (max-width:600px){.stop .sign{font-size:12px}.stop .full{display:none}.stop .short{display:inline}}' +
  '.road-x{position:absolute;left:8px;bottom:6px;pointer-events:auto;width:22px;height:22px;border-radius:50%;border:0;' +
    'background:#ffffff1f;color:#f3efe6;font:700 12px/22px system-ui,sans-serif;cursor:pointer;padding:0}' +
  '.road-x:hover{background:#ffffff3a}' +
  '.road-back{position:fixed;left:12px;bottom:12px;z-index:40;width:44px;height:44px;border-radius:50%;border:1px solid #e3ddd2;' +
    'background:#fff;font-size:22px;cursor:pointer;box-shadow:0 4px 12px #1b1f2a24;display:none}' +
  '.road-back.on{display:block}' +
  '@media (prefers-reduced-motion:reduce){.auto::before,.auto::after,.auto.idle svg{animation:none}.road{transition:none}}' +
  '';

  // side view, facing right; wheels are separate groups so they can spin
  var svg = '' +
  '<svg viewBox="0 0 200 130" aria-hidden="true">' +
  '<ellipse cx="104" cy="126" rx="88" ry="4" fill="#0006"/>' +
  '<g class="body">' +
    // canopy: rear panel + roof (yellow), with a darker trim line
    '<path d="M12 60 V33 Q12 12 35 11 H146 Q157 11 161 22 L163 31 H60 V60 Z" fill="#f3c623" stroke="#1d2b1f" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M16 26 Q18 15 35 15 H140" fill="none" stroke="#d9a90f" stroke-width="2"/>' +
    // passenger opening: seat, grab pole, fare meter, driver in khaki
    '<rect x="64" y="50" width="44" height="12" rx="4" fill="#2b2b2b"/>' +
    '<rect x="66" y="38" width="10" height="16" rx="3" fill="#2b2b2b"/>' +
    '<rect x="120" y="31" width="3" height="36" fill="#3a3a3a"/>' +
    '<rect x="104" y="36" width="14" height="10" rx="2" fill="#2a2a2a"/><rect x="106" y="38" width="10" height="4" fill="#ff5b4d"/>' +
    '<g class="driver"><rect x="128" y="44" width="18" height="20" rx="6" fill="#b89b5e"/><circle cx="138" cy="38" r="7" fill="#6b4a32"/>' +
      '<path d="M131 35 Q138 28 145 35" fill="#1f1f1f"/></g>' +
    // rear body (green) with wheel arch + yellow band
    '<path d="M10 58 H124 V100 H81 A24 24 0 0 0 33 100 H10 Z" fill="#1f9d4a" stroke="#1d2b1f" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<rect x="11" y="58" width="112" height="9" fill="#f3c623"/>' +
    '<path d="M22 78 H58 M22 84 H54 M90 80 H116" stroke="#17803b" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="6" y="66" width="6" height="10" rx="2" fill="#e8553f" stroke="#1d2b1f" stroke-width="1.5"/>' +
    '<rect x="2" y="94" width="12" height="4" rx="2" fill="#555"/>' +
    // front cowl (yellow) + windscreen + garland
    '<path d="M150 31 L163 31 L178 58 L150 64 Z" fill="#f3c623" stroke="#1d2b1f" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M153 34 L160 34 L172 56 L154 60 Z" fill="#cdeaf3" opacity=".85"/>' +
    '<g fill="#fffdf2" stroke="#d8d2bd" stroke-width=".6"><circle cx="152" cy="36" r="2"/><circle cx="152" cy="41" r="2"/><circle cx="152.5" cy="46" r="2"/>' +
      '<circle cx="153" cy="51" r="2"/><circle cx="154" cy="55.5" r="2"/><circle cx="151" cy="58" r="2.2" fill="#ff8a3d" stroke="#d96a20"/></g>' +
    // front body (green) + mudguard + headlight
    '<path d="M124 64 H152 L178 58 Q192 62 191 78 L188 94 Q176 86 160 94 L154 100 H124 Z" fill="#1f9d4a" stroke="#1d2b1f" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M150 101 Q168 82 188 101" fill="#1f9d4a" stroke="#1d2b1f" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<circle cx="189" cy="71" r="5" fill="#fff6c2" stroke="#1d2b1f" stroke-width="2"/>' +
    '<rect x="162" y="66" width="12" height="5" rx="2" fill="#ff9d2e" stroke="#1d2b1f" stroke-width="1.2"/>' +
  '</g>' +
  wheel('w1', 57, 106, 17) + wheel('w2', 169, 108, 15) +
  '</svg>';

  function wheel(cls, cx, cy, r) {
    return '<g class="wheel ' + cls + '" style="transform-origin:' + cx + 'px ' + cy + 'px">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#1b1b1b"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.55) + '" fill="#c9c9c9" stroke="#8a8a8a" stroke-width="1.5"/>' +
      '<path d="M' + (cx - r * 0.5) + ' ' + cy + ' H' + (cx + r * 0.5) + ' M' + cx + ' ' + (cy - r * 0.5) + ' V' + (cy + r * 0.5) + '" stroke="#6f6f6f" stroke-width="2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="#444"/></g>';
  }

  var lines = [
    ['Meter mele ₹20 kodi, saar.', 'Twenty on top of the meter, sir.'],
    ['Ellige hogbeku?', 'Where to?'],
    ['Return khaali barbeku, ₹50 extra.', 'I’ll be coming back empty, so fifty extra.'],
    ['Game nodidra? Super ide!', 'Seen the game? It’s really good!', true]
  ];
  function arrived(f) { return ['Bande! ₹' + f + '. Change illa, saar 🙂', 'Made it! ₹' + f + ', and sorry, no change.']; }

  function init() {
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var road = document.createElement('div'); road.className = 'road';
    road.innerHTML =
      '<div class="lane" aria-hidden="true"></div><button class="road-x" type="button" aria-label="Hide the auto">✕</button>' +
      '<a class="stop" href="' + GAME_URL + '" target="_blank" rel="noopener" aria-label="Nande Kano Bengaluru, the game">' +
        '<span class="pole"></span><span class="sign"><b>Next stop</b><span class="full">Nande Kano Bengaluru</span><span class="short">NKB</span></span></a>' +
      '<button class="auto" type="button" aria-label="Honk the auto-rickshaw from Nande Kano Bengaluru">' +
        '<span class="meter" aria-hidden="true">₹30<small>0.0 km</small></span>' +
        '<span class="bubble" role="status" aria-live="polite"></span>' + svg + '</button>';
    document.body.appendChild(road);
    var back = document.createElement('button'); back.className = 'road-back'; back.type = 'button';
    back.setAttribute('aria-label', 'Bring the auto back'); back.textContent = '🛺';
    document.body.appendChild(back);

    var auto = road.querySelector('.auto'), body = road.querySelector('.body'), driver = road.querySelector('.driver');
    var wheels = road.querySelectorAll('.wheel'), meter = road.querySelector('.meter'), bubble = road.querySelector('.bubble');

    function setOff(off) {
      road.classList.toggle('off', off); back.classList.toggle('on', off);
      document.body.classList.toggle('has-road', !off); store.set('hi-auto-off', off ? '1' : '0');
    }
    road.querySelector('.road-x').addEventListener('click', function () { setOff(true); });
    back.addEventListener('click', function () { setOff(false); });
    setOff(store.get('hi-auto-off') === '1');

    // ---- driving ----
    var x = 0, target = 0, vx = 0, face = 1, spin = 0, km = 0, parked = false, bubbleTimer = 0, lineIx = 0;
    var stopSign = road.querySelector('.stop .sign');
    function span() { return Math.max(0, road.clientWidth - auto.offsetWidth - 36 - stopSign.offsetWidth - 14); }
    function progress() {
      var max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1;
    }
    function fare() { return 30 + Math.max(0, km - 2) * 15; }
    function drawMeter() { meter.innerHTML = '₹' + Math.round(fare()) + '<small>' + km.toFixed(1) + ' km</small>'; }

    function say(main, sub, link) {
      bubble.innerHTML = main + (sub ? '<em>' + sub + '</em>' : '') +
        (link ? '<a href="' + GAME_URL + '" target="_blank" rel="noopener">Hop in → the game</a>' : '');
      bubble.style.setProperty('--shift', '0px'); bubble.classList.add('on'); clearTimeout(bubbleTimer);
      var r = bubble.getBoundingClientRect(), pad = 8, sh = 0;          // keep the bubble on screen, arrow still on the auto
      if (r.right > innerWidth - pad) sh = innerWidth - pad - r.right; else if (r.left < pad) sh = pad - r.left;
      bubble.style.setProperty('--shift', sh.toFixed(0) + 'px');
      bubbleTimer = setTimeout(function () { bubble.classList.remove('on'); }, link ? 6000 : 3200);
    }

    var ac;
    function honk() {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.2].forEach(function (d) {
          var o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), s = ac.currentTime + d;
          o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(410, s); o2.frequency.setValueAtTime(518, s);
          o.frequency.linearRampToValueAtTime(392, s + 0.15); f.type = 'lowpass'; f.frequency.value = 1700;
          g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.12, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.16);
          o.connect(f); o2.connect(f); f.connect(g); g.connect(ac.destination); o.start(s); o2.start(s); o.stop(s + 0.18); o2.stop(s + 0.18);
        });
      } catch (e) {}
    }

    auto.addEventListener('click', function () {
      honk();
      art.animate && art.animate([{ translate: '0 0' }, { translate: '0 -7px' }, { translate: '0 0' }], { duration: 260, easing: 'ease-out' });
      if (parked) { var a = arrived(Math.round(fare())); say(a[0], a[1], true); return; }
      var l = lines[lineIx++ % lines.length]; say(l[0], l[1], l[2]);
    });

    var art = auto.querySelector('svg'), lane = road.querySelector('.lane');
    function place() {
      auto.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
      art.style.transform = face < 0 ? 'scaleX(-1)' : '';
      auto.classList.toggle('back', face < 0);
      lane.style.transform = 'translateX(' + (-(x * 0.6) % 56).toFixed(1) + 'px)';
    }

    if (reduced) {
      // no motion: parked at the stop, meter shows the minimum fare
      x = span(); parked = true; place(); drawMeter();
      addEventListener('resize', function () { x = span(); place(); });
      return;
    }

    var running = false, last = 0;
    function settle() {                                       // nothing moving: hand over to the CSS idle animation
      running = false; vx = 0;
      body.style.transform = ''; driver.style.transform = '';
      auto.classList.remove('moving'); auto.classList.add('idle'); drawMeter();
      if (progress() > 0.985 && !parked) { parked = true; var a = arrived(Math.round(fare())); say(a[0], a[1], true); }
    }
    function kick() { if (!running && !road.classList.contains('off')) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
    function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var dx = (target - x) * Math.min(1, dt * 5);          // smooth follow = accelerate and brake
      vx = dx / Math.max(dt, 0.001);
      x += dx;
      if (Math.abs(vx) > 18) face = vx > 0 ? 1 : -1;
      km += Math.abs(dx) / Math.max(1, span()) * 4.2;  // one full ride down the page is about 4 km on any screen
      spin += dx / 16 * (180 / Math.PI) * (face > 0 ? 1 : -1);
      for (var i = 0; i < wheels.length; i++) wheels[i].style.transform = 'rotate(' + (spin * (i ? 1.13 : 1)).toFixed(1) + 'deg)';
      var tilt = Math.max(-4, Math.min(4, -vx / 140)) * (face > 0 ? 1 : -1);
      body.style.transform = 'rotate(' + tilt.toFixed(2) + 'deg)';
      driver.style.transform = 'translateY(' + (Math.sin(now / 55) * 0.8).toFixed(2) + 'px)';
      auto.classList.add('moving'); auto.classList.remove('idle');
      if (Math.abs(vx) > 6) { parked = false; drawMeter(); }
      place();
      if (Math.abs(target - x) < 0.4) { x = target; place(); settle(); return; }
      requestAnimationFrame(loop);
    }

    target = x = progress() * span(); place(); settle(); parked = progress() > 0.985;
    addEventListener('scroll', function () { target = progress() * span(); kick(); }, { passive: true });
    addEventListener('resize', function () { target = progress() * span(); kick(); });
    road.querySelector('.road-x').addEventListener('click', function () { running = false; });
    back.addEventListener('click', function () { setTimeout(kick, 50); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
