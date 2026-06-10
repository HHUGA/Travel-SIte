document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('explorer.html')) {
    const dests = window.TravelData.destinations;
    const grid = $('#destinations-grid');
    const search = $('#search-input');
    const fBtns = $$('.filter-btn');
    const empty = $('#empty-state');
    const resultsCount = $('#results-count');

    let activeFilter = 'all';
    let searchQuery = '';

    const render = () => {
      if (!grid) return;
      const filtered = dests.filter(d => {
        const matchC = activeFilter === 'all' || d.continent.toLowerCase() === activeFilter.toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchS = !query || 
          d.name.toLowerCase().includes(query) || 
          d.country.toLowerCase().includes(query) || 
          d.continent.toLowerCase().includes(query);
        return matchC && matchS;
      });

      if (filtered.length === 0) {
        empty.style.display = 'flex';
        resultsCount.textContent = 'Showing 0 matching destinations';
        grid.innerHTML = '';
        return;
      }

      empty.style.display = 'none';
      resultsCount.textContent = `Showing ${filtered.length} destination${filtered.length > 1 ? 's' : ''}`;
      
      grid.innerHTML = filtered.map(d => `
        <div class="destination-card reveal visible" data-id="${d.id}">
          <div class="card-img-wrapper">
            <img src="${d.image}" alt="${d.name}" class="card-img" loading="lazy">
            <button class="wishlist-btn-overlay ${TravelStore.isWishlisted(d.id) ? 'active' : ''}" data-id="${d.id}">
              ${TravelStore.isWishlisted(d.id) ? '♥' : '♡'}
            </button>
            <span class="card-continent-badge" style="position:absolute;bottom:14px;left:14px;background:rgba(var(--primary-rgb),0.85);color:#fff;padding:2px 8px;font-size:0.7rem;font-weight:700;border-radius:4px;text-transform:uppercase;">${d.continent}</span>
          </div>
          <div class="card-details">
            <span class="card-location">${d.country}</span>
            <h3>${d.name}</h3>
            <p>${d.description.substring(0, 115)}...</p>
            <div class="card-footer">
              <span class="card-meta-tag">💰 ${d.budgetRange.toUpperCase()}</span>
              <span class="card-meta-tag">🎒 ${d.type}</span>
              <span class="card-cta-text">Details &rarr;</span>
            </div>
          </div>
        </div>
      `).join('');
    };

    if (grid) {
      onEvent(grid, 'click', (e) => {
        const wishBtn = e.target.closest('.wishlist-btn-overlay');
        const card = e.target.closest('.destination-card');
        
        if (wishBtn) {
          e.stopPropagation();
          const destId = wishBtn.getAttribute('data-id');
          const dest = dests.find(d => d.id === destId);
          const added = TravelStore.toggleWishlist(destId);
          wishBtn.innerHTML = added ? '♥' : '♡';
          wishBtn.classList.toggle('active', added);
          showToast(added ? `${dest.name} wishlisted!` : `${dest.name} removed from wishlist.`, 'info');
        } else if (card) {
          const dest = dests.find(d => d.id === card.getAttribute('data-id'));
          if (dest) window.TravelModal.open(dest);
        }
      });
    }

    fBtns.forEach(btn => {
      onEvent(btn, 'click', () => {
        fBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        render();
      });
    });

    if (search) onEvent(search, 'input', (e) => { searchQuery = e.target.value; render(); });
    onEvent($('#reset-filters-btn'), 'click', () => {
      if (search) search.value = '';
      searchQuery = '';
      activeFilter = 'all';
      fBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
      render();
    });

    window.addEventListener('wishlistUpdated', render);
    render();
  }
});
