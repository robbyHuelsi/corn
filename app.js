(() => {
  'use strict';

  // --- Constants ---
  const TKM_GRAM = 325;                    // Tausendkornmasse in Gramm
  const GRAIN_MASS_KG = TKM_GRAM / 1e6;    // Masse eines Korns in kg (0.000325)
  const BULK_DENSITY = 750;                 // Schüttdichte in kg/m³
  const BATHTUB_LITERS = 150;              // Badewannenvolumen in Litern

  const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
  const fmt2 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
  const fmt3 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3 });

  // --- DOM refs ---
  const slider = document.getElementById('wealthSlider');
  const wealthInput = document.getElementById('wealthInput');
  const wealthDisplay = document.getElementById('wealthDisplay');
  const compareSelect = document.getElementById('compareSelect');
  const customGroup = document.getElementById('customWealthGroup');
  const customWealth = document.getElementById('customWealth');

  const outCount = document.getElementById('outCount');
  const outMass = document.getElementById('outMass');
  const outEdge = document.getElementById('outEdge');
  const outBathtubs = document.getElementById('outBathtubs');
  const stepsContainer = document.getElementById('stepsContainer');

  // --- Helpers ---

  /** Parse a German-formatted number string (dots as thousands sep, comma as decimal) */
  function parseDe(str) {
    if (!str) return NaN;
    const cleaned = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned);
  }

  /** Format a number in German locale for the input field (no decimals) */
  function formatInput(n) {
    return fmt.format(Math.round(n));
  }

  /** Smart unit formatting for mass */
  function formatMass(kg) {
    if (kg < 1) return fmt1.format(kg * 1000) + ' g';
    if (kg < 1000) return fmt2.format(kg) + ' kg';
    if (kg < 1e6) return fmt2.format(kg / 1000) + ' t';
    return fmt1.format(kg / 1000) + ' t';
  }

  /** Smart unit formatting for edge length */
  function formatLength(m) {
    if (m < 0.01) return fmt1.format(m * 1000) + ' mm';
    if (m < 1) return fmt1.format(m * 100) + ' cm';
    if (m < 1000) return fmt2.format(m) + ' m';
    return fmt2.format(m / 1000) + ' km';
  }

  /** Smart formatting for bathtubs */
  function formatBathtubs(n) {
    if (n < 10) return fmt2.format(n);
    if (n < 1000) return fmt1.format(n);
    if (n < 1e6) return fmt.format(n);
    return fmt1.format(n / 1e6) + ' Mio.';
  }

  /** Smart formatting for corn count */
  function formatCount(n) {
    if (n < 1e6) return fmt.format(n);
    if (n < 1e9) return fmt1.format(n / 1e6) + ' Mio.';
    if (n < 1e12) return fmt1.format(n / 1e9) + ' Mrd.';
    return fmt1.format(n / 1e12) + ' Bio.';
  }

  // --- State ---

  function getMyWealth() {
    return parseFloat(slider.value) || 1;
  }

  function getCompareWealth() {
    if (compareSelect.value === 'custom') {
      return parseDe(customWealth.value) || 0;
    }
    return parseFloat(compareSelect.value) || 0;
  }

  // --- Calculation ---

  function calculate() {
    const myWealth = getMyWealth();
    const compareW = getCompareWealth();

    if (myWealth <= 0 || compareW <= 0) {
      outCount.textContent = '–';
      outMass.textContent = '–';
      outEdge.textContent = '–';
      outBathtubs.textContent = '–';
      stepsContainer.innerHTML = '<em class="text-muted">Bitte Werte eingeben.</em>';
      return;
    }

    const count = compareW / myWealth;
    const massKg = count * GRAIN_MASS_KG;
    const volumeM3 = massKg / BULK_DENSITY;
    const edgeM = Math.cbrt(volumeM3);
    const bathtubs = (volumeM3 * 1000) / BATHTUB_LITERS;

    outCount.textContent = formatCount(count);
    outMass.textContent = formatMass(massKg);
    outEdge.textContent = formatLength(edgeM);
    outBathtubs.textContent = formatBathtubs(bathtubs);
    renderSteps(myWealth, compareW, count, massKg, volumeM3, edgeM, bathtubs);
  }

  // --- Rechenweg ---

  function renderSteps(myW, compW, count, massKg, volM3, edgeM, baths) {
    const fmtEur = v => fmt.format(v) + ' €';
    const volL = volM3 * 1000;
    stepsContainer.innerHTML = `
      <p class="mb-2 text-muted"><strong>Konstanten:</strong>
        Tausendkornmasse (TKM) = ${TKM_GRAM} g · Schüttdichte = ${BULK_DENSITY} kg/m³ · Badewanne = ${BATHTUB_LITERS} L</p>
      <ol class="mb-0">
        <li class="mb-2">
          <strong>Anzahl Körner</strong><br>
          <code>${fmtEur(compW)} ÷ ${fmtEur(myW)} = ${fmt2.format(count)} Körner</code>
        </li>
        <li class="mb-2">
          <strong>Masse</strong><br>
          <code>${fmt2.format(count)} × (${TKM_GRAM} g ÷ 1.000) = ${fmt2.format(count * TKM_GRAM / 1000)} g = ${formatMass(massKg)}</code>
        </li>
        <li class="mb-2">
          <strong>Schüttvolumen</strong><br>
          <code>${formatMass(massKg)} ÷ ${BULK_DENSITY} kg/m³ = ${fmt3.format(volM3)} m³ (${fmt1.format(volL)} Liter)</code>
        </li>
        <li class="mb-2">
          <strong>Quader-Kantenlänge</strong> (Würfel)<br>
          <code>∛${fmt3.format(volM3)} m³ = ${formatLength(edgeM)}</code>
        </li>
        <li>
          <strong>Badewannen</strong><br>
          <code>${fmt1.format(volL)} L ÷ ${BATHTUB_LITERS} L = ${fmt2.format(baths)} Badewannen</code>
        </li>
      </ol>`;
  }

  // --- Sync slider ↔ input ---

  function syncSliderToInput() {
    const val = Math.round(parseFloat(slider.value));
    wealthInput.value = formatInput(val);
    wealthDisplay.textContent = formatInput(val) + ' €';
  }

  function syncInputToSlider() {
    const val = parseDe(wealthInput.value);
    if (!isNaN(val) && val >= 1) {
      const clamped = Math.min(Math.max(Math.round(val), 1), 10000000);
      slider.value = clamped;
      wealthDisplay.textContent = formatInput(clamped) + ' €';
    }
  }

  // --- Events ---

  slider.addEventListener('input', () => {
    syncSliderToInput();
    calculate();
  });

  wealthInput.addEventListener('input', () => {
    syncInputToSlider();
    calculate();
  });

  // Allow values beyond slider range via text input
  wealthInput.addEventListener('change', () => {
    const val = parseDe(wealthInput.value);
    if (!isNaN(val) && val >= 1) {
      slider.value = Math.min(Math.max(Math.round(val), 1), 10000000);
      wealthInput.value = formatInput(val);
      wealthDisplay.textContent = formatInput(val) + ' €';
      calculate();
    }
  });

  compareSelect.addEventListener('change', () => {
    if (compareSelect.value === 'custom') {
      customGroup.classList.remove('d-none');
      customWealth.focus();
    } else {
      customGroup.classList.add('d-none');
    }
    calculate();
  });

  customWealth.addEventListener('input', () => {
    calculate();
  });

  customWealth.addEventListener('change', () => {
    const val = parseDe(customWealth.value);
    if (!isNaN(val) && val >= 0) {
      customWealth.value = formatInput(val);
    }
    calculate();
  });

  // --- Load wealthy list from YAML ---
  function formatWealth(value) {
    if (value >= 1e9) return fmt1.format(value / 1e9) + ' Mrd. €';
    if (value >= 1e6) return fmt1.format(value / 1e6) + ' Mio. €';
    return fmt.format(value) + ' €';
  }

  function populateDropdown(entries) {
    compareSelect.innerHTML = '';
    entries.forEach(entry => {
      const wealthEur = entry.wealth * 1e9;
      const opt = document.createElement('option');
      opt.value = wealthEur;
      opt.textContent = entry.name + ' — ' + formatWealth(wealthEur);
      compareSelect.appendChild(opt);
    });
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = 'Eigenen Wert eingeben…';
    compareSelect.appendChild(customOpt);
    calculate();
  }

  fetch('./wealthy.yaml')
    .then(res => res.text())
    .then(text => populateDropdown(jsyaml.load(text)))
    .catch(() => {
      compareSelect.innerHTML = '<option value="custom" selected>Eigenen Wert eingeben…</option>';
      customGroup.classList.remove('d-none');
    });

  // --- Initial ---
  syncSliderToInput();

  // --- Service Worker ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'activated') location.reload();
        });
      });
    }).catch(() => {});
  }
})();
