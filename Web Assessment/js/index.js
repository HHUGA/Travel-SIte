document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.includes('.html')) {
    const quotes = window.TravelData.quotes;
    const quoteTxt = $('#quote-display');
    const quoteAuth = $('#quote-author');
    const bar = $('#quote-progress-bar');
    
    let qIdx = 0;
    const cycleTime = 6000;

    const rotateQuote = () => {
      if (!quoteTxt || !quoteAuth) return;
      quoteTxt.style.opacity = '0';
      quoteAuth.style.opacity = '0';

      setTimeout(() => {
        const q = quotes[qIdx];
        quoteTxt.textContent = q.text;
        quoteAuth.textContent = `— ${q.author}`;
        quoteTxt.style.opacity = '1';
        quoteAuth.style.opacity = '1';
        
        if (bar) {
          bar.style.transition = 'none';
          bar.style.width = '0%';
          bar.offsetHeight;
          bar.style.transition = `width ${cycleTime}ms linear`;
          bar.style.width = '100%';
        }
        qIdx = (qIdx + 1) % quotes.length;
      }, 300);
    };

    rotateQuote();
    setInterval(rotateQuote, cycleTime);

    const dotdBox = $('#dotd-card-container');
    const dests = window.TravelData.destinations;
    if (dotdBox && dests && dests.length > 0) {
      const today = new Date();
      const idx = (today.getDate() + today.getMonth() + today.getFullYear()) % dests.length;
      const dest = dests[idx];

      dotdBox.innerHTML = `
        <div class="dotd-image" style="background-image: url('${dest.image}')">
          <span class="dotd-badge">Destination of the Day</span>
        </div>
        <div class="dotd-info">
          <div>
            <span class="dotd-country">${dest.country}</span>
            <h3>${dest.name}</h3>
          </div>
          <div class="dotd-meta">
            <span class="dotd-meta-item">🌍 ${dest.continent}</span>
            <span class="dotd-meta-item">🎒 ${dest.type.charAt(0).toUpperCase() + dest.type.slice(1)}</span>
            <span class="dotd-meta-item">💰 ${dest.budgetRange.toUpperCase()} Budget</span>
          </div>
          <p class="dotd-desc">${dest.description.substring(0, 160)}...</p>
          <button class="btn btn-primary dotd-cta" id="explore-dotd-btn">Explore Full Details</button>
        </div>
      `;
      onEvent($('#explore-dotd-btn'), 'click', () => window.TravelModal.open(dest));
    }
  }
});
