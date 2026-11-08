// ---- Config -------------------------------------------------------------
// Paste a form endpoint (e.g. https://formspree.io/f/xxxxxxx) to collect
// survey answers. While it's empty, answers open as a pre-filled email instead.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'getdairee@gmail.com';
// -------------------------------------------------------------------------

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll effects: header state, hide-on-scroll-down, progress line, parallax
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
const heroBg = document.querySelector('.hero-bg');
const parallaxImgs = [...document.querySelectorAll('.parallax img')];
let lastY = window.scrollY;
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('scrolled', y > 24);
  if (!document.body.classList.contains('nav-open')) {
    if (y > lastY + 4 && y > 320) header.classList.add('hide');
    else if (y < lastY - 4 || y < 320) header.classList.remove('hide');
  }
  lastY = y;
  progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

  if (!reduceMotion) {
    if (y < window.innerHeight * 1.2) heroBg.style.setProperty('--hy', `${(y * 0.28).toFixed(1)}px`);
    parallaxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -0.07;
      img.style.setProperty('--py', `${offset.toFixed(1)}px`);
    });
  }
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

// Split headlines into words so they can rise in one by one
document.querySelectorAll('h2, .footer-big').forEach((el) => {
  let i = 0;
  const wrap = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--wi', i++);
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrap(child);
      }
    });
  };
  wrap(el);
  el.classList.add('split-ready');
});

// Stagger sibling reveals (cards, pillars, steps…)
document.querySelectorAll('.reveal').forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  const idx = sibs.indexOf(el);
  if (sibs.length > 1 && idx > 0) el.style.setProperty('--sd', `${Math.min(idx, 5) * 110}ms`);
});

// Mobile nav
const toggle = document.getElementById('navToggle');
const setNav = (open) => {
  document.body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// Reveal on scroll
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

// Process orbit: tap a step to show it; gently auto-cycles until someone interacts
const orbit = document.getElementById('orbit');
const stepBtns = [...document.querySelectorAll('.step-btn')];
let auto = null;
const setStep = (i) => {
  orbit.dataset.step = String(i);
  stepBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
};
const orbitWrap = orbit.parentElement;
const stopAuto = () => { clearInterval(auto); auto = null; orbitWrap.classList.remove('auto'); };
stepBtns.forEach((b, i) => b.addEventListener('click', () => { stopAuto(); setStep(i); }));
if (!reduceMotion && 'IntersectionObserver' in window) {
  let touched = false;
  stepBtns.forEach((b) => b.addEventListener('click', () => { touched = true; }));
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !auto && !touched) {
      orbitWrap.classList.add('auto');
      setStep(Number(orbit.dataset.step));
      auto = setInterval(() => {
        setStep((Number(orbit.dataset.step) + 1) % stepBtns.length);
        // restart the progress bar on the newly active step
        orbitWrap.classList.remove('auto'); void orbitWrap.offsetWidth; orbitWrap.classList.add('auto');
      }, 3200);
    } else if (!e.isIntersecting) stopAuto();
  }, { threshold: 0.4 }).observe(orbit.parentElement);
}

// Survey
const form = document.getElementById('survey');
const status = document.getElementById('formStatus');
const say = (msg, err = false) => { status.textContent = msg; status.classList.toggle('error', err); };

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const answered = ['grow', 'feed', 'try'].some((k) => data.getAll(k).length) || data.get('concern').trim();
  const email = data.get('email').trim();

  const consent = data.get('consent') === 'yes';
  if (consent && !email) return say('Add your email so we can send you updates.', true);
  if (!answered && !email) return say('Pick at least one answer, or leave your email.', true);
  if (email && !form.email.checkValidity()) return say('That email doesn’t look quite right.', true);
  if (email && !consent) return say('To get updates, tick the box below your email. Or clear the email to just send your answers.', true);

  const summary = {
    grows: data.getAll('grow').join(', ') || '—',
    uses_plant_food: data.get('feed') || '—',
    would_try: data.get('try') || '—',
    hesitation: data.get('concern').trim() || '—',
    email: email || '—',
    email_updates_consent: consent ? 'yes' : 'no',
  };

  if (FORM_ENDPOINT) {
    const btn = form.querySelector('button');
    btn.disabled = true;
    say('Sending…');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(summary),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      form.classList.remove('sent'); void form.offsetWidth; form.classList.add('sent');
      say('Thank you! Your answers really help us decide what to build.');
    } catch {
      say('Something went wrong. Please try again, or email us.', true);
    } finally {
      btn.disabled = false;
    }
    return;
  }

  // No endpoint yet: open a pre-filled email so no answers are lost
  const body = Object.entries(summary).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n');
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Dairee survey answers')}&body=${encodeURIComponent(body)}`;
  say('Your email app should open with your answers. Just hit send. Thank you!');
});

// Copy-email buttons
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(btn.parentElement.querySelector('.supplier-email'));
      sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = 'Selected, press copy';
    }
    setTimeout(() => { btn.textContent = 'Copy email'; }, 2200);
  });
});

// Hero: tap the sprout to replay the drop
const heroArt = document.getElementById('heroArt');
heroArt.addEventListener('click', () => {
  heroArt.classList.remove('play');
  void heroArt.offsetWidth;
  heroArt.classList.add('play');
});

document.getElementById('year').textContent = new Date().getFullYear();
