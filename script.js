// Sticky header shadow
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const toggle = document.getElementById('navToggle');
toggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach((a) =>
  a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Reveal on scroll + count-up stats
const countUp = (el) => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const dur = 1400;
  const tick = (t) => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
}

// Contact form (front-end only — wire to a backend/form service when ready)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = 'Please fill in your name, a valid email and a message.';
    return;
  }
  status.textContent = 'Thank you! We’ll be in touch shortly.';
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
