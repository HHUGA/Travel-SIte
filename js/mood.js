document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('mood.html')) {
    let actx = null;
    const playState = {};
    const mix = { beach: 0.5, forest: 0.5, city: 0.5 };

    const getAudio = () => {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      return actx;
    };

    const getNoiseNode = (ctx) => {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      return source;
    };

    const createBeachNode = (ctx, gainNode) => {
      const noise = getNoiseNode(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const mod = ctx.createGain();
      mod.gain.value = 140;

      lfo.connect(mod);
      mod.connect(filter.frequency);
      noise.connect(filter);
      filter.connect(gainNode);

      noise.start();
      lfo.start();
      return { stop: () => { noise.stop(); lfo.stop(); } };
    };

    const createForestNode = (ctx, gainNode) => {
      const noise = getNoiseNode(ctx);

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 400;
      noise.connect(windFilter);
      windFilter.connect(gainNode);

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'highpass';
      rainFilter.frequency.value = 3200;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.12;
      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(gainNode);

      noise.start();

      let chirpTimer = null;
      const scheduleChirp = () => {
        if (ctx.state === 'closed' || !playState['forest']) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(1600 + Math.random() * 600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);

        chirpTimer = setTimeout(scheduleChirp, 4000 + Math.random() * 5000);
      };
      scheduleChirp();

      return { stop: () => { noise.stop(); clearTimeout(chirpTimer); } };
    };

    const createCityNode = (ctx, gainNode) => {
      const drone = ctx.createOscillator();
      drone.frequency.value = 55;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 90;

      drone.connect(filter);
      filter.connect(gainNode);
      drone.start();

      let hornTimer = null;
      const scheduleHorn = () => {
        if (ctx.state === 'closed' || !playState['city']) return;
        const h1 = ctx.createOscillator();
        const h2 = ctx.createOscillator();
        const gain = ctx.createGain();

        h1.frequency.value = 330;
        h2.frequency.value = 390;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

        h1.connect(gain);
        h2.connect(gain);
        gain.connect(gainNode);

        h1.start(); h2.start();
        h1.stop(ctx.currentTime + 1.5);
        h2.stop(ctx.currentTime + 1.5);

        hornTimer = setTimeout(scheduleHorn, 6000 + Math.random() * 7000);
      };
      scheduleHorn();

      return { stop: () => { drone.stop(); clearTimeout(hornTimer); } };
    };

    const toggleAudioSynth = (name, btn) => {
      const ctx = getAudio();

      if (playState[name]) {
        playState[name].stop();
        playState[name].gain.disconnect();
        delete playState[name];
        btn.textContent = `Play ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        $(`#sound-${name}`).classList.remove('playing');
        showToast(`${name} synthesizer stopped`, 'info');
      } else {
        const gain = ctx.createGain();
        gain.gain.value = mix[name];
        gain.connect(ctx.destination);

        let node;
        if (name === 'beach') node = createBeachNode(ctx, gain);
        if (name === 'forest') node = createForestNode(ctx, gain);
        if (name === 'city') node = createCityNode(ctx, gain);

        playState[name] = { stop: node.stop, gain };
        btn.textContent = `Stop ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        $(`#sound-${name}`).classList.add('playing');
        showToast(`${name} ambient synth active!`, 'success');
      }
    };

    $$('.play-sound-btn').forEach(btn => {
      onEvent(btn, 'click', () => toggleAudioSynth(btn.getAttribute('data-sound'), btn));
    });

    $$('.vol-slider').forEach(slider => {
      onEvent(slider, 'input', (e) => {
        const name = slider.getAttribute('data-sound');
        const val = parseFloat(e.target.value);
        mix[name] = val;
        if (playState[name]) {
          playState[name].gain.gain.setValueAtTime(val, actx.currentTime);
        }
      });
    });

    const dests = window.TravelData.destinations;
    const tracker = $('#tracker-grid');

    const renderTrackerGrid = () => {
      if (!tracker) return;
      const logs = TravelStore.get('tn_mood_states', {});

      tracker.innerHTML = dests.map(d => {
        const state = logs[d.id] || 'none';
        const isVisited = state === 'visited';
        const isPlanned = state === 'planned';

        let badgeHTML = '';
        if (isVisited) badgeHTML = `<span class="tracker-badge visited-badge">✓ Visited</span>`;
        if (isPlanned) badgeHTML = `<span class="tracker-badge planned-badge">★ Planned</span>`;

        return `
          <div class="tracker-card ${isVisited ? 'visited' : ''} ${isPlanned ? 'planned' : ''}">
            <div class="tracker-img-wrapper" style="background-image:url('${d.image}')">
              ${badgeHTML}
            </div>
            <div class="tracker-details">
              <h4>${d.name}</h4>
              <p>${d.country}</p>
              <div class="mood-toggles">
                <button class="mood-toggle-btn btn-visited ${isVisited ? 'active' : ''}" data-id="${d.id}">Visited</button>
                <button class="mood-toggle-btn btn-planned ${isPlanned ? 'active' : ''}" data-id="${d.id}">Planned</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    };

    if (tracker) {
      onEvent(tracker, 'click', (e) => {
        const btn = e.target.closest('.mood-toggle-btn');
        if (!btn) return;

        const id = btn.getAttribute('data-id');
        const isV = btn.classList.contains('btn-visited');
        const logs = TravelStore.get('tn_mood_states', {});
        const current = logs[id] || 'none';

        let next = 'none';
        if (isV) {
          next = current === 'visited' ? 'none' : 'visited';
        } else {
          next = current === 'planned' ? 'none' : 'planned';
        }

        if (next === 'none') delete logs[id]; else logs[id] = next;
        TravelStore.set('tn_mood_states', logs);

        const dest = dests.find(d => d.id === id);
        showToast(next === 'none' ? `Cleared logs for ${dest.name}` : `Marked ${dest.name} logs!`, 'info');
        renderTrackerGrid();
      });
    }

    renderTrackerGrid();
  }
});
