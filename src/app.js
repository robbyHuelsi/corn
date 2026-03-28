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

  // --- State ---
  let selectedAgeGroup = null;

  // --- DOM refs ---
  const slider = document.getElementById('wealthSlider');
  const wealthInput = document.getElementById('wealthInput');
  const wealthDisplay = document.getElementById('wealthDisplay');
  const compareSelect = document.getElementById('compareSelect');
  const customGroup = document.getElementById('customWealthGroup');
  const customWealth = document.getElementById('customWealth');
  const ageGroupGrid = document.getElementById('ageGroupGrid');
  const ageGroupHint = document.getElementById('ageGroupHint');
  const resultSummary = document.getElementById('resultSummary');

  const outCount = document.getElementById('outCount');
  const outMass = document.getElementById('outMass');
  const outEdge = document.getElementById('outEdge');
  const outBathtubs = document.getElementById('outBathtubs');
  const stepsContainer = document.getElementById('stepsContainer');

  // --- Views ---
  const views = ['view-age', 'view-wealth', 'view-compare', 'view-result'];
  const steps = ['step1', 'step2', 'step3', 'step4'];

  function showView(viewId) {
    const viewIndex = views.indexOf(viewId);
    views.forEach((id, i) => {
      const el = document.getElementById(id);
      if (id === viewId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    steps.forEach((id, i) => {
      const el = document.getElementById(id);
      if (i < viewIndex) {
        el.classList.remove('active');
        el.classList.add('done');
      } else if (i === viewIndex) {
        el.classList.add('active');
        el.classList.remove('done');
      } else {
        el.classList.remove('active');
        el.classList.remove('done');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Navigation buttons ---
  document.getElementById('backToAge').addEventListener('click', () => showView('view-age'));
  document.getElementById('goToCompare').addEventListener('click', () => showView('view-compare'));
  document.getElementById('backToWealth').addEventListener('click', () => showView('view-wealth'));
  document.getElementById('goToResult').addEventListener('click', () => {
    calculate();
    showView('view-result');
  });
  document.getElementById('backToCompare').addEventListener('click', () => showView('view-compare'));
  document.getElementById('restart').addEventListener('click', () => {
    selectedAgeGroup = null;
    document.querySelectorAll('.age-group-card').forEach(c => c.classList.remove('selected'));
    ageGroupHint.textContent = '';
    compareSelect.selectedIndex = 0;
    customGroup.classList.add('d-none');
    customWealth.value = '';
    showView('view-age');
  });

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

  /** Format wealth value for display */
  function formatWealth(value) {
    if (value >= 1e9) return fmt1.format(value / 1e9) + ' Mrd. €';
    if (value >= 1e6) return fmt1.format(value / 1e6) + ' Mio. €';
    return fmt.format(value) + ' €';
  }

  // --- State accessors ---

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
      resultSummary.innerHTML = '';
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
    renderSummary(myWealth, compareW, count);
  }

  // --- Result summary ---

  function renderSummary(myW, compW, count) {
    const selectedOption = compareSelect.options[compareSelect.selectedIndex];
    const compareName = selectedOption
      ? (selectedOption.dataset.name || selectedOption.text)
      : 'Die Vergleichsperson';
    resultSummary.innerHTML = '';
    const line1 = document.createElement('div');
    line1.className = 'summary-line';
    line1.innerHTML = `Mit einem Vermögen von <strong>${formatWealth(myW)}</strong> entspricht <strong>1 Maiskorn</strong> genau <strong>1 €</strong> deines Vermögens.`;
    const line2 = document.createElement('div');
    line2.className = 'summary-line mt-1';
    line2.innerHTML = `Das Vermögen von <strong></strong> (<strong>${formatWealth(compW)}</strong>) entspricht <strong>${formatCount(count)} Maiskörnern</strong>.`;
    line2.querySelector('strong').textContent = compareName;
    resultSummary.appendChild(line1);
    resultSummary.appendChild(line2);
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
  });

  wealthInput.addEventListener('input', () => {
    syncInputToSlider();
  });

  wealthInput.addEventListener('change', () => {
    const val = parseDe(wealthInput.value);
    if (!isNaN(val) && val >= 1) {
      slider.value = Math.min(Math.max(Math.round(val), 1), 10000000);
      wealthInput.value = formatInput(val);
      wealthDisplay.textContent = formatInput(val) + ' €';
    }
  });

  compareSelect.addEventListener('change', () => {
    if (compareSelect.value === 'custom') {
      customGroup.classList.remove('d-none');
      customWealth.focus();
    } else {
      customGroup.classList.add('d-none');
    }
  });

  customWealth.addEventListener('change', () => {
    const val = parseDe(customWealth.value);
    if (!isNaN(val) && val >= 0) {
      customWealth.value = formatInput(val);
    }
  });

  // --- Age group selection ---

  function selectAgeGroup(group, cardEl) {
    selectedAgeGroup = group;
    document.querySelectorAll('.age-group-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    // Pre-fill slider with median wealth
    const val = Math.min(Math.max(Math.round(group.medianWealth), 1), 10000000);
    slider.value = val;
    wealthInput.value = formatInput(val);
    wealthDisplay.textContent = formatInput(val) + ' €';

    // Update hint text using safe DOM methods
    ageGroupHint.innerHTML = '';
    const icon = document.createElement('i');
    icon.className = 'bi bi-info-circle me-1';
    const labelStrong = document.createElement('strong');
    labelStrong.textContent = group.label;
    const medianStrong = document.createElement('strong');
    medianStrong.textContent = formatWealth(group.medianWealth);
    ageGroupHint.appendChild(icon);
    ageGroupHint.append('Altersgruppe: ');
    ageGroupHint.appendChild(labelStrong);
    ageGroupHint.append(' · Median: ');
    ageGroupHint.appendChild(medianStrong);

    showView('view-wealth');
  }

  function renderAgeGroups(groups) {
    ageGroupGrid.innerHTML = '';
    groups.forEach(group => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'age-group-card';

      const labelDiv = document.createElement('div');
      labelDiv.className = 'age-group-label';
      labelDiv.textContent = group.label;

      const medianDiv = document.createElement('div');
      medianDiv.className = 'age-group-median';
      medianDiv.append('Median: ');
      const strong = document.createElement('strong');
      strong.textContent = formatWealth(group.medianWealth);
      medianDiv.appendChild(strong);

      card.appendChild(labelDiv);
      card.appendChild(medianDiv);
      card.addEventListener('click', () => selectAgeGroup(group, card));
      ageGroupGrid.appendChild(card);
    });
  }

  // --- Load wealthy list from YAML ---

  function populateDropdown(entries) {
    compareSelect.innerHTML = '';
    entries.forEach(entry => {
      const wealthEur = entry.wealth * 1e9;
      const opt = document.createElement('option');
      opt.value = wealthEur;
      opt.dataset.name = entry.name;
      opt.textContent = entry.name + ' \u2014 ' + formatWealth(wealthEur);
      compareSelect.appendChild(opt);
    });
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = 'Eigenen Wert eingeben\u2026';
    compareSelect.appendChild(customOpt);
  }

  // --- Data loading ---

  fetch('./age-groups.yaml')
    .then(r => r.text())
    .then(t => jsyaml.load(t))
    .then(data => renderAgeGroups(data))
    .catch(() => {
      ageGroupGrid.innerHTML = '<p class="text-danger">Fehler beim Laden der Altersgruppen.</p>';
    });

  fetch('./wealthy.yaml')
    .then(r => r.text())
    .then(t => jsyaml.load(t))
    .then(data => populateDropdown(data))
    .catch(() => {
      compareSelect.innerHTML = '<option value="custom" selected>Eigenen Wert eingeben\u2026</option>';
      customGroup.classList.remove('d-none');
    });

  // --- Initial ---
  syncSliderToInput();
  showView('view-age');

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
