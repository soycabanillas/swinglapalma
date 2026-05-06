/* ================================================================
   Swing La Palma — Landing JS (vanilla)
   · i18n (es / en) — also keeps <html lang> in sync
   · Theme (light / dark) — paired with FOUC guard inline in <head>
   · WhatsApp QR
   ================================================================ */

(function () {
  'use strict';

  // ---- CONFIG --------------------------------------------------
  // WhatsApp Business "Short Link". The pre-filled greeting message
  // is configured server-side in the WhatsApp Business app — NOT here.
  // To change the greeting: WhatsApp Business → Settings → Business
  // tools → Short Link → Default message.
  // Set WHATSAPP_READY = false to show the "Próximamente / Coming soon"
  // placeholder state (blurred-out QR + Facebook fallback link).
  var WHATSAPP_URL   = 'https://wa.me/message/N5YIEUWD64XEM1';
  var WHATSAPP_READY = true;

  var FACEBOOK_URL  = 'https://www.facebook.com/swinglapalma/';
  var INSTAGRAM_URL = 'https://www.instagram.com/swinglapalma/';

  // ---- i18n ----------------------------------------------------
  var I18N = {
    es: {
      heroEyebrow:   'Escuela de baile · La Palma · Canarias',
      heroTagline:   'Lindy Hop · Balboa',
      heroSubtitle:  'Aprende a bailar en una isla que ya tiene swing. Clases de Lindy Hop y Balboa, sin experiencia previa y sin pareja necesaria.',
      ctaPrimary:    'Avísame cuando empiece',
      ctaSecondary:  'Conoce a los profes',

      introEyebrow:  'Qué vas a bailar',
      introTitle:    'Dos bailes. Una misma música.',
      lindyTitle:    'Lindy Hop',
      lindyText:     'Nacido en el Harlem de los años veinte y treinta, es el baile madre del swing: enérgico, improvisado y profundamente musical. Se baila en pareja, pero la pareja cambia toda la noche.',
      balboaTitle:   'Balboa',
      balboaText:    'Surgido en las salas abarrotadas de la California de los treinta, es elegante, cercano y rápido. Menos espacio, más conexión, mucha escucha. El baile de los tempos imposibles.',

      aboutEyebrow:  'Quiénes somos',
      aboutTitle:    'Más de quince años en la pista.',
      aboutP1:       'Llevamos más de quince años bailando swing. Hemos dado y recibido talleres por toda Europa, competido en algún festival y pisado escenarios de vez en cuando — pero sobre todo hemos bailado social, noche tras noche.',
      aboutP2:       'Ahora traemos esa misma energía a La Palma: clases regulares, un espacio cálido para principiantes y un lugar donde los que ya bailan puedan seguir creciendo.',

      notifyEyebrow: 'Aviso de inicio de curso',
      notifyTitle:   'Te avisamos cuando empecemos.',
      notifySub:     'Escanea el código con el móvil y recibirás un mensaje cuando abramos inscripciones. Nada más.',
      qrKicker:      'WhatsApp',
      qrNote:        'Solo se usará para avisar del inicio de las clases. No lo usamos para comunicación general.',
      qrLinkFallback:'¿No puedes escanear? Abrir WhatsApp',
      qrSoonBadge:   'Próximamente',
      qrSoonNote:    'Estamos terminando de configurar el WhatsApp. Estará disponible en los próximos días — mientras tanto, escríbenos por Facebook.',
      qrSoonLink:    'Avisarme por Facebook',

      footerMade:    'Hecho en La Palma con paciencia y mucho swing',
      footerTag:     'Lindy Hop · Balboa · Canarias',

      ariaThemeLight:'Cambiar a modo oscuro',
      ariaThemeDark: 'Cambiar a modo claro'
    },
    en: {
      heroEyebrow:   'Dance school · La Palma · Canary Islands',
      heroTagline:   'Lindy Hop · Balboa',
      heroSubtitle:  'Learn to dance on an island that already swings. Lindy Hop & Balboa classes — beginners welcome, partners not required.',
      ctaPrimary:    'Tell me when you start',
      ctaSecondary:  'Meet the teachers',

      introEyebrow:  'What you’ll dance',
      introTitle:    'Two dances. One music.',
      lindyTitle:    'Lindy Hop',
      lindyText:     'Born in 1920s–1930s Harlem, Lindy is the root of all swing dances: energetic, improvised, deeply musical. Danced in pairs, but the pair changes all night long.',
      balboaTitle:   'Balboa',
      balboaText:    'Born in the crowded ballrooms of 1930s California, Balboa is elegant, close, and fast. Less floor, more connection, a lot of listening. The dance for impossible tempos.',

      aboutEyebrow:  'Who we are',
      aboutTitle:    'Over fifteen years on the floor.',
      aboutP1:       'We’ve been dancing swing for more than fifteen years. We’ve taught and taken workshops across Europe, competed at the odd festival, and stepped on a few stages — but mostly, we’ve danced social, night after night.',
      aboutP2:       'Now we’re bringing that same energy to La Palma: weekly classes, a warm room for beginners, and a place where dancers who already swing can keep growing.',

      notifyEyebrow: 'Start-of-term alert',
      notifyTitle:   'We’ll let you know when we start.',
      notifySub:     'Scan the code with your phone and we’ll send a message when enrolment opens. Nothing else.',
      qrKicker:      'WhatsApp',
      qrNote:        'Used only to announce the start of classes. Not for general chat.',
      qrLinkFallback:'Can’t scan? Open WhatsApp',
      qrSoonBadge:   'Coming soon',
      qrSoonNote:    'We’re still setting up our WhatsApp. It will be live in the next few days — in the meantime, message us on Facebook.',
      qrSoonLink:    'Message us on Facebook',

      footerMade:    'Made on La Palma with patience and a lot of swing',
      footerTag:     'Lindy Hop · Balboa · Canary Islands',

      ariaThemeLight:'Switch to dark mode',
      ariaThemeDark: 'Switch to light mode'
    }
  };

  // ---- helpers -------------------------------------------------
  var state = {
    lang:  document.documentElement.getAttribute('lang') || 'es',
    theme: document.documentElement.getAttribute('data-theme') || 'light'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---- i18n ----------------------------------------------------
  function applyLang(lang) {
    if (!I18N[lang]) lang = 'es';
    state.lang = lang;
    var dict = I18N[lang];

    document.documentElement.setAttribute('lang', lang);

    document.title = lang === 'es'
      ? 'Swing La Palma — Lindy Hop y Balboa en La Palma'
      : 'Swing La Palma — Lindy Hop & Balboa on La Palma';

    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', lang === 'es'
        ? 'Escuela de Lindy Hop y Balboa en la isla de La Palma. Sin experiencia previa, sin pareja necesaria.'
        : 'Lindy Hop & Balboa dance school on the island of La Palma. No experience, no partner required.');
    }

    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    var qrNoteEl    = document.querySelector('.notify-card--qr .notify-card-note');
    var qrLinkLabel = document.querySelector('#qrLink span[data-i18n="qrLinkFallback"], #qrLink span:first-child');
    var qrBadgeEl   = document.querySelector('.notify-card--qr .qr-soon-badge');
    if (!WHATSAPP_READY) {
      if (qrNoteEl)    qrNoteEl.textContent    = dict.qrSoonNote || dict.qrNote;
      if (qrLinkLabel) qrLinkLabel.textContent = dict.qrSoonLink || dict.qrLinkFallback;
      if (qrBadgeEl)   qrBadgeEl.textContent   = dict.qrSoonBadge || '';
    } else {
      if (qrNoteEl)    qrNoteEl.textContent    = dict.qrNote;
      if (qrLinkLabel) qrLinkLabel.textContent = dict.qrLinkFallback;
    }

    $$('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    var themeBtn = $('#themeToggle');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label',
        state.theme === 'dark' ? dict.ariaThemeDark : dict.ariaThemeLight);
    }

    try { localStorage.setItem('slp-lang', lang); } catch (e) {}
  }

  // ---- theme ---------------------------------------------------
  function applyTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('slp-theme', theme); } catch (e) {}

    var themeBtn = $('#themeToggle');
    if (themeBtn) {
      var dict = I18N[state.lang] || I18N.es;
      themeBtn.setAttribute('aria-label',
        theme === 'dark' ? dict.ariaThemeDark : dict.ariaThemeLight);
    }
  }

  // ---- WhatsApp QR ---------------------------------------------
  function renderQR() {
    var target = $('#qrcode');
    var link   = $('#qrLink');
    var card   = document.querySelector('.notify-card--qr');
    if (!target) return;
    var url = WHATSAPP_URL;

    if (card) card.classList.toggle('is-coming-soon', !WHATSAPP_READY);
    if (link) link.setAttribute('href', WHATSAPP_READY ? url : FACEBOOK_URL);

    target.innerHTML = '';
    if (typeof QRCode === 'undefined') {
      target.innerHTML = '<div style="font:13px/1.4 Manrope,sans-serif;color:#6b5f54;padding:16px;text-align:center">' +
        (state.lang === 'es'
          ? 'No se pudo cargar el QR. Toca el enlace de abajo.'
          : 'Could not load the QR. Use the link below.') +
        '</div>';
      return;
    }
    /* eslint-disable no-new */
    new QRCode(target, {
      text: url,
      width: 480,
      height: 480,
      colorDark:  '#151210',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // ---- Hero sunburst -------------------------------------------
  function buildSunburst() {
    var group = document.querySelector('.sunburst-rays');
    if (!group) return;
    var rays = 32;
    var svgNS = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < rays; i++) {
      var angle = (i / rays) * Math.PI * 2;
      var line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', 800);
      line.setAttribute('y1', 450);
      line.setAttribute('x2', String(800 + Math.cos(angle) * 1400));
      line.setAttribute('y2', String(450 + Math.sin(angle) * 1400));
      group.appendChild(line);
    }
  }

  // ---- Wiring --------------------------------------------------
  function wireEvents() {
    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });

    var themeBtn = $('#themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    if (window.matchMedia) {
      var mql = window.matchMedia('(prefers-color-scheme: dark)');
      var listener = function (e) {
        if (!localStorage.getItem('slp-theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };
      if (mql.addEventListener) mql.addEventListener('change', listener);
      else if (mql.addListener) mql.addListener(listener);
    }

    var yr = $('#footerYear');
    if (yr) yr.textContent = String(new Date().getFullYear());

    $$('a[href*="facebook.com"]').forEach(function (a) {
      a.setAttribute('href', FACEBOOK_URL);
    });
    $$('a[href*="instagram.com"]').forEach(function (a) {
      a.setAttribute('href', INSTAGRAM_URL);
    });
  }

  // ---- Init ----------------------------------------------------
  function init() {
    buildSunburst();
    wireEvents();
    applyLang(state.lang);
    applyTheme(state.theme);
    renderQR();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
