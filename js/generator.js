document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('generator.html')) {
    const dests = window.TravelData.destinations;
    const form = $('#generator-form');
    const styleSel = $('#gen-type');
    const budgetSel = $('#gen-budget');
    const btn = $('#spin-btn');
    const reel = $('#generator-reel');
    const wishlist = $('#wishlist-grid');

    let activeSpin = false;
    let selectedWinner = null;

    if (form) {
      onEvent(form, 'submit', (e) => {
        e.preventDefault();
        if (activeSpin) return;

        const type = styleSel.value;
        const budget = budgetSel.value;

        const matches = dests.filter(d => {
          return (type === 'all' || d.type === type) && (budget === 'all' || d.budgetRange === budget);
        });

        if (matches.length === 0) {
          showToast('No destinations found for these parameters!', 'error');
          reel.innerHTML = `
            <div class="reel-placeholder">
              <div class="roulette-icon">⚠️</div>
              <h3>No Matches Found</h3>
              <p>Try broadening your style or budget criteria.</p>
            </div>`;
          return;
        }

        activeSpin = true;
        btn.disabled = true;
        btn.textContent = 'Generating...';
        reel.classList.add('spinning');

        let ticks = 0;
        const maxTicks = 12;
        const spinTime = setInterval(() => {
          const temp = matches[Math.floor(Math.random() * matches.length)];
          reel.innerHTML = `
            <div class="suggested-card">
              <div class="suggested-img-wrapper" style="background-image:url('${temp.image}')"></div>
              <div class="suggested-details">
                <h3>${temp.name}</h3>
                <span class="suggested-country">${temp.country}</span>
              </div>
            </div>`;
          
          if (++ticks >= maxTicks) {
            clearInterval(spinTime);
            setTimeout(() => {
              reel.classList.remove('spinning');
              selectedWinner = matches[Math.floor(Math.random() * matches.length)];
              
              const isWish = TravelStore.isWishlisted(selectedWinner.id);
              reel.innerHTML = `
                <div class="suggested-card">
                  <div class="suggested-img-wrapper" style="background-image:url('${selectedWinner.image}')">
                    <span class="suggested-badge">${selectedWinner.continent}</span>
                  </div>
                  <div class="suggested-details">
                    <span class="suggested-country">${selectedWinner.country}</span>
                    <h3>${selectedWinner.name}</h3>
                    <div class="suggested-tags">
                      <span class="suggested-tag">🎒 ${selectedWinner.type}</span>
                      <span class="suggested-tag">💰 ${selectedWinner.budgetRange.toUpperCase()}</span>
                    </div>
                    <p class="suggested-desc">${selectedWinner.description}</p>
                    <div class="suggested-actions">
                      <button class="btn btn-secondary" id="save-spin-btn">${isWish ? '♥ Wishlisted' : '♡ Save to Wishlist'}</button>
                      <button class="btn btn-secondary" id="details-spin-btn">Explore Highlights</button>
                      <button class="btn btn-primary" id="plan-spin-btn">Plan Trip</button>
                    </div>
                  </div>
                </div>`;
              
              activeSpin = false;
              btn.disabled = false;
              btn.textContent = 'Surprise Me Again! 🎲';
              showToast(`Say hello to ${selectedWinner.name}!`, 'success');
            }, 150);
          }
        }, 110);
      });
    }

    if (reel) {
      onEvent(reel, 'click', (e) => {
        if (!selectedWinner) return;
        if (e.target.closest('#save-spin-btn')) {
          const added = TravelStore.toggleWishlist(selectedWinner.id);
          e.target.closest('#save-spin-btn').textContent = added ? '♥ Wishlisted' : '♡ Save to Wishlist';
          showToast(added ? `${selectedWinner.name} wishlisted!` : 'Removed from wishlist.', 'info');
          renderWishlistGrid();
        } else if (e.target.closest('#details-spin-btn')) {
          window.TravelModal.open(selectedWinner);
        } else if (e.target.closest('#plan-spin-btn')) {
          const theme = localStorage.getItem('tn_theme') || 'light';
          window.location.href = `budget.html?dest=${selectedWinner.id}&theme=${theme}`;
        }
      });
    }

    const renderWishlistGrid = () => {
      if (!wishlist) return;
      const ids = TravelStore.get('tn_wishlist', []);
      const saved = dests.filter(d => ids.includes(d.id));

      if (saved.length === 0) {
        wishlist.innerHTML = `
          <div class="wishlist-empty">
            <div class="wishlist-empty-icon">♥</div>
            <h3>Your wishlist is empty</h3>
            <p>Spin the generator above or explore details to save items here!</p>
          </div>`;
        return;
      }

      wishlist.innerHTML = saved.map(d => `
        <div class="wishlist-card" id="wish-card-${d.id}">
          <div class="wishlist-img" style="background-image:url('${d.image}')">
            <button class="wishlist-remove-btn" data-id="${d.id}">&times;</button>
          </div>
          <div class="wishlist-details">
            <h4>${d.name}</h4>
            <p>${d.country}</p>
            <div class="wishlist-card-actions">
              <button class="btn btn-secondary details-wish-btn" data-id="${d.id}">Details</button>
              <button class="btn btn-primary plan-wish-btn" data-id="${d.id}">Plan</button>
            </div>
          </div>
        </div>
      `).join('');
    };

    if (wishlist) {
      onEvent(wishlist, 'click', (e) => {
        const remove = e.target.closest('.wishlist-remove-btn');
        const details = e.target.closest('.details-wish-btn');
        const plan = e.target.closest('.plan-wish-btn');

        if (remove) {
          const id = remove.getAttribute('data-id');
          const card = $(`#wish-card-${id}`);
          TravelStore.toggleWishlist(id);
          if (card) {
            card.classList.add('fade-out');
            setTimeout(renderWishlistGrid, 300);
          } else {
            renderWishlistGrid();
          }
          showToast('Removed from wishlist.', 'info');
        } else if (details) {
          const dest = dests.find(d => d.id === details.getAttribute('data-id'));
          if (dest) window.TravelModal.open(dest);
        } else if (plan) {
          const theme = localStorage.getItem('tn_theme') || 'light';
          window.location.href = `budget.html?dest=${plan.getAttribute('data-id')}&theme=${theme}`;
        }
      });
    }

    renderWishlistGrid();
  }
});
