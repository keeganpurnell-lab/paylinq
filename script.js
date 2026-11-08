// ---- Config -------------------------------------------------------------
// Paste a form endpoint (e.g. https://formspree.io/f/xxxxxxx) to collect
// survey answers. While it's empty, answers open as a pre-filled email instead.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'hello@dairee.com';
// -------------------------------------------------------------------------

// Header: transparent over the hero, solid once scrolled
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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
const stopAuto = () => { clearInterval(auto); auto = null; };
stepBtns.forEach((b, i) => b.addEventListener('click', () => { stopAuto(); setStep(i); }));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  let touched = false;
  stepBtns.forEach((b) => b.addEventListener('click', () => { touched = true; }));
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !auto && !touched) {
      auto = setInterval(() => setStep((Number(orbit.dataset.step) + 1) % stepBtns.length), 3200);
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

  if (!answered && !email) return say('Pick at least one answer, or leave your email.', true);
  if (email && !form.email.checkValidity()) return say('That email doesn’t look quite right.', true);

  const summary = {
    grows: data.getAll('grow').join(', ') || '—',
    uses_plant_food: data.get('feed') || '—',
    would_try: data.get('try') || '—',
    hesitation: data.get('concern').trim() || '—',
    email: email || '—',
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

document.getElementById('year').textContent = new Date().getFullYear();
