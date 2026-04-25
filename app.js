/* ===== MATRIX RAIN ===== */
(function () {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 20);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()!<>/\\|{}[]';
  function draw() {
    ctx.fillStyle = 'rgba(4, 13, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 20, drops[i] * 20);
      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 60);
})();

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== TERMINAL TYPING EFFECT ===== */
function typeText(el, text, speed, cb) {
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(interval); if (cb) cb(); }
  }, speed);
}

window.addEventListener('DOMContentLoaded', () => {
  const cmd1 = document.getElementById('cmd1');
  const out1 = document.getElementById('output1');
  const cmd2Line = document.getElementById('cmd2-line');
  const cmd2 = document.getElementById('cmd2');
  const out2 = document.getElementById('output2');
  const cursorLine = document.getElementById('cursor-line');

  setTimeout(() => {
    typeText(cmd1, 'whoami --verbose', 60, () => {
      setTimeout(() => {
        out1.style.display = 'block';
        setTimeout(() => {
          cmd2Line.style.display = 'block';
          typeText(cmd2, 'cat mission.txt', 60, () => {
            setTimeout(() => {
              out2.style.display = 'block';
              cursorLine.style.display = 'block';
            }, 200);
          });
        }, 600);
      }, 300);
    });
  }, 500);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ===== INTERSECTION OBSERVER ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    // Skill bars
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });

    // Counters (only for hero section)
    if (entry.target.id === 'hero') animateCounters();

    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => {
  s.classList.add('fade-in');
  observer.observe(s);
});

/* Trigger hero immediately */
const hero = document.getElementById('hero');
hero.classList.add('visible');
animateCounters();


/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--green)' : '';
  });
});
