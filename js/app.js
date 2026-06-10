const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const onEvent = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

const TravelStore = {
  get: (key, fallback = null) => {
    try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : fallback; } catch(e) { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  },
  toggleWishlist(id) {
    const list = this.get('tn_wishlist', []);
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id); else list.splice(idx, 1);
    this.set('tn_wishlist', list);
    return idx === -1;
  },
  isWishlisted: (id) => TravelStore.get('tn_wishlist', []).includes(id)
};

window.showToast = (msg, type = 'success') => {
  let box = $('.toast-container');
  if (!box) {
    box = document.createElement('div');
    box.className = 'toast-container';
    box.style = 'position:fixed;bottom:24px;right:24px;z-index:1100;display:flex;flex-direction:column;gap:10px;max-width:320px;';
    document.body.appendChild(box);
  }
  const toast = document.createElement('div');
  toast.className = `badge badge-${type === 'success' ? 'low' : type === 'error' ? 'danger' : 'moderate'}`;
  toast.style = 'padding:14px 20px;box-shadow:0 10px 30px rgba(0,0,0,0.15);background:var(--card);border-left:4px solid var(--primary);border-radius:8px;font-weight:600;display:flex;align-items:center;gap:10px;transform:translateY(20px);opacity:0;transition:all 0.3s;';
  if (type === 'error') toast.style.borderLeftColor = 'var(--error)';
  if (type === 'info') toast.style.borderLeftColor = 'var(--info)';
  
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  toast.innerHTML = `<span style="font-weight:800;color:var(--primary);">${icons[type] || '⚡'}</span> <span>${msg}</span>`;
  box.appendChild(toast);

  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 50);
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)'; toast.style.opacity = '0';
    setTimeout(() => { toast.remove(); if (box.children.length === 0) box.remove(); }, 300);
  }, 3000);
};

const SVG_LOGO = `
  <svg viewBox="0 0 24 24">
    <path d="M22 2L2 8.667l6.667 2.666L18.667 4 10 13.333l2.667 6.667L22 2z" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

window.TravelModal = {
  open(dest) {
    let dialog = $('#global-destination-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'global-destination-dialog';
      dialog.className = 'modal-box';
      document.body.appendChild(dialog);
    }
    
    dialog.classList.toggle('dark-theme', document.documentElement.classList.contains('dark-theme'));

    const globalAvg = { accommodation: 80, food: 25, transport: 10, activities: 20 };
    const totalDest = Object.values(dest.costs).reduce((a,b) => a+b, 0);
    const totalGlob = Object.values(globalAvg).reduce((a,b) => a+b, 0);

    dialog.innerHTML = `
      <button class="modal-close-btn" onclick="this.closest('dialog').close()">&times;</button>
      <div class="modal-hero" style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url('${dest.image}')">
        <span class="modal-badge">${dest.continent}</span>
        <h2>${dest.name}</h2>
        <p class="modal-subtitle">${dest.country}</p>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <h3>About the Destination</h3>
          <p class="modal-desc">${dest.description}</p>
        </div>
        <div class="modal-section">
          <h3>Popular Attractions</h3>
          <ul class="modal-attractions">
            ${dest.attractions.map(attr => `<li><span class="star-bullet">★</span> ${attr}</li>`).join('')}
          </ul>
        </div>
        <div class="modal-section">
          <h3>Estimated Daily Cost Comparison</h3>
          <div class="table-responsive">
            <table class="modal-cost-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>${dest.name} ($)</th>
                  <th>Global Avg ($)</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                ${Object.keys(dest.costs).map(key => {
                  const diff = dest.costs[key] - globalAvg[key];
                  return `
                    <tr>
                      <td class="capitalize">${key}</td>
                      <td>$${dest.costs[key]}</td>
                      <td>$${globalAvg[key]}</td>
                      <td class="${diff > 0 ? 'cost-more' : diff < 0 ? 'cost-less' : ''}">
                        ${diff > 0 ? `+$${diff}` : diff < 0 ? `-$${Math.abs(diff)}` : 'Equal'}
                      </td>
                    </tr>`;
                }).join('')}
                <tr class="table-row-total">
                  <td>Total Daily</td>
                  <td>$${totalDest}</td>
                  <td>$${totalGlob}</td>
                  <td class="${totalDest > totalGlob ? 'cost-more' : 'cost-less'}">
                    ${totalDest > totalGlob ? `+$${totalDest - totalGlob}` : `-$${totalGlob - totalDest}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary wishlist-modal-btn">
            ${TravelStore.isWishlisted(dest.id) ? '♥ Wishlisted' : '♡ Add to Wishlist'}
          </button>
          <button class="btn btn-primary plan-trip-btn">Plan Trip</button>
        </div>
      </div>
    `;

    const wishlistBtn = dialog.querySelector('.wishlist-modal-btn');
    onEvent(wishlistBtn, 'click', () => {
      const added = TravelStore.toggleWishlist(dest.id);
      wishlistBtn.innerHTML = added ? '♥ Wishlisted' : '♡ Add to Wishlist';
      showToast(added ? `${dest.name} added to wishlist!` : `${dest.name} removed from wishlist.`, 'info');
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { id: dest.id, added } }));
    });

    onEvent(dialog.querySelector('.plan-trip-btn'), 'click', () => {
      dialog.close();
      const theme = localStorage.getItem('tn_theme') || 'light';
      window.location.href = `budget.html?dest=${dest.id}&theme=${theme}`;
    });

    dialog.showModal();
    dialog.onclick = (e) => { if (e.target === dialog) dialog.close(); };
  }
};

function updateThemeUI(theme) {
  document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  $$('.theme-toggle').forEach(btn => btn.innerHTML = theme === 'dark' ? '☀️' : '🌙');
  
  $$('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.endsWith('.html') || href.includes('.html?'))) {
      const base = href.split('?')[0];
      const params = new URLSearchParams(href.split('?')[1] || '');
      params.set('theme', theme);
      link.setAttribute('href', `${base}?${params.toString()}`);
    }
  });
}

function initTheme() {
  const params = new URLSearchParams(window.location.search);
  let theme = params.get('theme');
  if (theme) localStorage.setItem('tn_theme', theme);
  else theme = localStorage.getItem('tn_theme') || 'light';
  updateThemeUI(theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark-theme');
  const nextTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('tn_theme', nextTheme);
  updateThemeUI(nextTheme);

  const dialog = $('#global-destination-dialog');
  if (dialog) dialog.classList.toggle('dark-theme', nextTheme === 'dark');

  showToast(`${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} theme activated`, 'info');
}

function buildLayout() {
  const header = $('#global-header');
  const footer = $('#global-footer');

  if (header) {
    header.innerHTML = `
      <div class="container navbar">
        <a href="index.html" class="logo">
          ${SVG_LOGO}
          <span>Travel<span class="logo-accent">Nest</span></span>
        </a>
        <div class="nav-container">
          <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="explorer.html">Explorer</a></li>
            <li><a href="budget.html">Budget</a></li>
            <li><a href="generator.html">Surprise Me</a></li>
            <li><a href="mood.html">Travel Mood</a></li>
            <li><a href="feedback.html">Feedback</a></li>
          </ul>
          <button class="theme-toggle" aria-label="Toggle dark mode">🌙</button>
          <button class="hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="container footer-grid">
        <div class="footer-about">
          <a href="index.html" class="logo">
            ${SVG_LOGO}
            <span>Travel<span class="logo-accent">Nest</span></span>
          </a>
          <p>A minimalist workspace designed to make travel planning, budget estimates, and offline journaling visually beautiful and simple.</p>
        </div>
        <div class="footer-links-col">
          <h4>Sitemap</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="explorer.html">Explorer</a></li>
            <li><a href="budget.html">Planner</a></li>
            <li><a href="generator.html">Generator</a></li>
            <li><a href="mood.html">Mood Board</a></li>
            <li><a href="feedback.html">FAQ Support</a></li>
          </ul>
        </div>
        <div class="footer-newsletter">
          <h4>Newsletter Updates</h4>
          <p>Join to receive hand-picked deal alerts. Saved locally offline.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" class="form-control" id="newsletter-email" placeholder="Your email address" required aria-label="Email">
            <button type="submit" class="btn btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom container">
        <p>&copy; 2026 TravelNest. Fully compliant with HTML5, CSS3, PWA Caching. Designed for Viva.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  buildLayout();
  initTheme();

  $$('.theme-toggle').forEach(btn => onEvent(btn, 'click', toggleTheme));

  const hamburger = $('.hamburger');
  const navLinks = $('.nav-links');
  if (hamburger && navLinks) {
    onEvent(hamburger, 'click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href').startsWith(page));
  });

  const newsletterForm = $('#newsletter-form');
  if (newsletterForm) {
    onEvent(newsletterForm, 'submit', (e) => {
      e.preventDefault();
      const emailInput = $('#newsletter-email');
      const email = emailInput.value.trim();
      
      const list = TravelStore.get('tn_newsletter', []);
      if (list.includes(email)) {
        showToast('This email is already subscribed!', 'info');
      } else {
        list.push(email);
        TravelStore.set('tn_newsletter', list);
        showToast('Subscribed to newsletter updates!', 'success');
        emailInput.value = '';
      }
    });
  }

  const reveals = $$('.reveal');
  if (reveals.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => obs.observe(el));
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA ServiceWorker Active', reg.scope))
      .catch(err => console.error('PWA Registration Skipped', err));
  }
});
