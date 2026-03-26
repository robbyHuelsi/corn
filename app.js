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

  // --- Initial ---
  syncSliderToInput();
  calculate();

  // --- Service Worker ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
})();
