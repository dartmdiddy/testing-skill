(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader: counts 0 -> 100, then slides away */
  var countEl = document.getElementById('loaderCount');
  var duration = reduce ? 300 : 1800;
  var start = null;

  function finish() {
    root.classList.add('is-loaded');
    setTimeout(function () { root.classList.add('is-done'); }, reduce ? 0 : 900);
  }

  function tick(ts) {
    if (start === null) start = ts;
    var t = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    countEl.textContent = Math.round(eased * 100);
    if (t < 1) { requestAnimationFrame(tick); } else { finish(); }
  }

  if (countEl) { requestAnimationFrame(tick); } else { finish(); }
  /* Safety net so the page never stays covered */
  setTimeout(finish, 5000);

  /* Flavor switching */
  var names = {
    lemon: 'Citrus Lemon',
    blueberry: 'Blueberry Rush',
    strawberry: 'Wild Strawberry',
    orange: 'Solar Orange',
    apple: 'Green Apple'
  };
  var heroFlavor = document.getElementById('heroFlavor');
  var chips = document.querySelectorAll('.chip');

  function pick(key) {
    if (!names[key]) return;
    document.body.setAttribute('data-flavor', key);
    heroFlavor.textContent = names[key];
    chips.forEach(function (chip) {
      var on = chip.getAttribute('data-pick') === key;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-pick]').forEach(function (el) {
    el.addEventListener('click', function () {
      pick(el.getAttribute('data-pick'));
      if (el.classList.contains('link')) {
        document.getElementById('top').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  /* Scroll reveal */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Email sign-up (front-end only: no backend is connected) */
  var form = document.getElementById('signup');
  var msg = document.getElementById('signupMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('email');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = ok ? 'YAAS! You are on the list.' : 'Please enter a valid email address.';
    if (ok) form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
