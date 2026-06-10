document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('budget.html')) {
    const dests = window.TravelData.destinations;
    const destSelect = $('#budget-destination');
    const customGroup = $('#custom-destination-group');
    const customName = $('#custom-destination-name');
    
    const form = $('#budget-form');
    const daysInput = $('#budget-days');
    const dailyInput = $('#budget-daily');

    const placeholder = $('#results-placeholder');
    const results = $('#results-content');
    const totalVal = $('#estimate-total-val');
    const allotVal = $('#daily-allotted-val');
    const badge = $('#badge-style');
    const fill = $('#progress-bar-fill');
    const percent = $('#gauge-percent-val');
    const label = $('#gauge-label');
    const desc = $('#gauge-recommendation');
    const saveBtn = $('#save-budget-btn');
    const plansTable = $('#saved-plans-body');

    let forecastData = null;

    if (destSelect) {
      [...dests].sort((a,b) => a.name.localeCompare(b.name)).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.country})`;
        destSelect.insertBefore(opt, destSelect.lastElementChild);
      });

      onEvent(destSelect, 'change', () => {
        const isC = destSelect.value === 'custom';
        customGroup.classList.toggle('hide', !isC);
        if (isC) customName.setAttribute('required', 'required');
        else customName.removeAttribute('required');
      });
    }

    const animatePrice = (el, endVal) => {
      const startTime = performance.now();
      const frame = (now) => {
        const progress = Math.min((now - startTime) / 800, 1);
        el.textContent = `$${Math.floor(progress * endVal).toLocaleString()}`;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    if (form) {
      onEvent(form, 'submit', (e) => {
        e.preventDefault();
        const id = destSelect.value;
        const days = parseInt(daysInput.value, 10);
        const daily = parseFloat(dailyInput.value);

        let name = 'Custom Trip';
        let benchmark = 120;

        if (id !== 'custom') {
          const destObj = dests.find(d => d.id === id);
          if (destObj) {
            name = destObj.name;
            benchmark = Object.values(destObj.costs).reduce((a,b) => a+b, 0);
          }
        } else {
          name = customName.value.trim() || 'Custom Trip';
        }

        const total = daily * days;
        const style = daily < 50 ? 'low' : daily > 150 ? 'luxury' : 'moderate';
        const ratio = Math.min(100, Math.round((daily / benchmark) * 100));

        let state = 'success';
        let strength = 'Budget Strength';
        let advice = `Optimal: Daily forecast matches benchmark costs ($${benchmark}/day) for ${name}. Perfect balance.`;

        if (ratio < 70) {
          state = 'danger'; strength = 'Budget Shortfall';
          advice = `Warning: Your daily forecast is below standard costs ($${benchmark}/day) for ${name}. Adjust accordingly.`;
        } else if (ratio > 130) {
          state = 'warning'; strength = 'Budget Premium';
          advice = `Comfortable: Your budget exceeds benchmarks ($${benchmark}/day) for ${name}. High-end options active!`;
        }

        forecastData = { destinationName: name, days, daily, total, style };

        placeholder.classList.add('hide');
        results.classList.remove('hide');

        animatePrice(totalVal, total);
        allotVal.textContent = `$${Math.round(daily)}`;
        badge.textContent = style.toUpperCase();
        badge.className = `badge badge-${style}`;
        
        fill.className = `progress-bar-fill ${state}`;
        setTimeout(() => { fill.style.width = `${ratio}%`; }, 40);
        percent.textContent = `${ratio}%`;
        label.textContent = strength;
        desc.textContent = advice;

        showToast('Trip forecasts computed successfully!', 'success');
      });
    }

    if (saveBtn) {
      onEvent(saveBtn, 'click', () => {
        if (!forecastData) return;
        const list = TravelStore.get('tn_budgets', []);
        list.push({ id: 'bgt_' + Date.now(), date: new Date().toLocaleDateString(), ...forecastData });
        TravelStore.set('tn_budgets', list);
        showToast('Itinerary budget saved locally!', 'success');
        renderSavedTable();
      });
    }

    const renderSavedTable = () => {
      if (!plansTable) return;
      const list = TravelStore.get('tn_budgets', []);

      if (list.length === 0) {
        plansTable.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No saved estimates found.</td></tr>`;
        return;
      }
      plansTable.innerHTML = list.map(item => `
        <tr>
          <td><strong>${item.destinationName}</strong></td>
          <td>${item.days}</td>
          <td>$${item.daily}</td>
          <td><strong>$${item.total.toLocaleString()}</strong></td>
          <td><span class="badge badge-${item.style}">${item.style}</span></td>
          <td>${item.date}</td>
          <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
        </tr>
      `).join('');
    };

    if (plansTable) {
      onEvent(plansTable, 'click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (btn) {
          const list = TravelStore.get('tn_budgets', []).filter(b => b.id !== btn.getAttribute('data-id'));
          TravelStore.set('tn_budgets', list);
          showToast('Itinerary log deleted.', 'info');
          renderSavedTable();
        }
      });
    }

    renderSavedTable();

    const urlParams = new URLSearchParams(window.location.search);
    const destParam = urlParams.get('dest');
    if (destParam && destSelect) {
      destSelect.value = destParam;
      destSelect.dispatchEvent(new Event('change'));
      setTimeout(() => { if (daysInput) daysInput.focus(); }, 300);
    }
  }
});
