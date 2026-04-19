(() => {
    "use strict";

    // --- Constants ---
    const TKM_GRAM = 325; // Tausendkornmasse in Gramm
    const GRAIN_MASS_KG = TKM_GRAM / 1e6; // Masse eines Korns in kg (0.000325)
    const BULK_DENSITY = 750; // Schüttdichte in kg/m³
    const BATHTUB_LITERS = 180; // Badewannenvolumen in Litern

    const fmt = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
    const fmt1 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
    const fmt2 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
    const fmt3 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });

    // --- State ---
    let _selectedAgeGroup = null;
    let _overallMedian = null;
    let _skippedAgeGroup = false;
    let _selectedCompareWealth = null;
    let _selectedCompareName = null;

    // --- DOM refs ---
    const slider = document.getElementById("wealthSlider");
    const wealthInput = document.getElementById("wealthInput");
    const wealthDisplay = document.getElementById("wealthDisplay");
    const compareGrid = document.getElementById("compareGrid");
    const ageGroupGrid = document.getElementById("ageGroupGrid");
    const wealthDescription = document.getElementById("wealthDescription");
    const skipAgeGroupContainer = document.getElementById("skipAgeGroupContainer");
    const resultSummary = document.getElementById("resultSummary");
    const splitWealthModalEl = document.getElementById("splitWealthModal");
    const splitWealthDivisor = document.getElementById("splitWealthDivisor");
    const applySplitWealth = document.getElementById("applySplitWealth");
    const splitWealthError = document.getElementById("splitWealthError");
    const splitWealthButtons = document.querySelectorAll(".split-wealth-btn");

    const outCount = document.getElementById("outCount");
    const outMass = document.getElementById("outMass");
    const outEdge = document.getElementById("outEdge");
    const outBathtubs = document.getElementById("outBathtubs");
    const stepsContainer = document.getElementById("stepsContainer");

    // --- Views ---
    const views = ["view-age", "view-wealth", "view-compare", "view-result", "view-context", "view-solutions"];
    const steps = ["step1", "step2", "step3", "step4"];

    function showView(viewId) {
        const viewIndex = views.indexOf(viewId);
        views.forEach((id) => {
            const el = document.getElementById(id);
            if (id === viewId) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
        steps.forEach((id, i) => {
            const el = document.getElementById(id);
            if (i < viewIndex) {
                el.classList.remove("active");
                el.classList.add("done");
            } else if (i === viewIndex) {
                el.classList.add("active");
                el.classList.remove("done");
            } else {
                el.classList.remove("active");
                el.classList.remove("done");
            }
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // --- Navigation buttons ---
    document.getElementById("backToAge").addEventListener("click", () => showView("view-age"));
    document.getElementById("goToCompare").addEventListener("click", () => showView("view-compare"));
    document.getElementById("backToWealth").addEventListener("click", () => showView("view-wealth"));
    document.getElementById("backToCompare").addEventListener("click", () => showView("view-compare"));
    document.getElementById("goToContext").addEventListener("click", () => showView("view-context"));
    document.getElementById("goToSolutions").addEventListener("click", () => showView("view-solutions"));
    document.getElementById("goToSolutionsFromContext").addEventListener("click", () => showView("view-solutions"));
    document.getElementById("backToResult").addEventListener("click", () => showView("view-result"));
    document.getElementById("backToContext").addEventListener("click", () => showView("view-context"));
    document.getElementById("restartFromSolutions").addEventListener("click", () => {
        document.getElementById("restart").click();
    });
    document.getElementById("resetToMedian").addEventListener("click", () => {
        const median = _selectedAgeGroup ? _selectedAgeGroup.medianWealth : _overallMedian;
        if (median == null) return;
        const val = Math.min(Math.max(Math.round(median), 1), 10000000);
        slider.value = val;
        wealthInput.value = formatInput(val);
        wealthDisplay.textContent = formatInput(val) + "\u00A0€";
    });

    document.getElementById("restart").addEventListener("click", () => {
        _selectedAgeGroup = null;
        _skippedAgeGroup = false;
        _selectedCompareWealth = null;
        _selectedCompareName = null;
        document.querySelectorAll(".age-group-card").forEach((c) => c.classList.remove("selected"));
        const customWealth = document.getElementById("customWealth");
        if (customWealth) {
            customWealth.value = "";
        }
        const compareGrid = document.getElementById("compareGrid");
        if (compareGrid) {
            compareGrid.querySelectorAll(".selected").forEach((c) => c.classList.remove("selected"));
        }
        setWealthDescription(null, _overallMedian);
        showView("view-age");
    });

    // --- Helpers ---

    function setWealthDescription(group, median) {
        wealthDescription.innerHTML = "";
        if (group) {
            // Age group path
            wealthDescription.append("In Haushalten, in denen die älteste Person in Deiner Altersgruppe (");
            const labelStrong = document.createElement("strong");
            labelStrong.textContent = group.label;
            wealthDescription.appendChild(labelStrong);
            wealthDescription.append(") ist, betr\u00E4gt das mittlere Nettoverm\u00F6gen ");
            const medianStrong = document.createElement("strong");
            medianStrong.textContent = formatWealth(group.medianWealth);
            wealthDescription.appendChild(medianStrong);
            wealthDescription.append(".");
        } else {
            // Skip path
            wealthDescription.append("Das mittlere Nettoverm\u00F6gen aller Haushalte in Deutschland betr\u00E4gt ");
            const medianStrong = document.createElement("strong");
            medianStrong.textContent = median == null ? "–" : formatWealth(median);
            wealthDescription.appendChild(medianStrong);
            wealthDescription.append(".");
        }
        const sup = document.createElement("sup");
        const fnLink = document.createElement("a");
        fnLink.href = "#fn1";
        fnLink.textContent = "[1]";
        sup.appendChild(fnLink);
        wealthDescription.appendChild(sup);
        wealthDescription.append(
            " Passe den Wert an Deine pers\u00F6nliche Situation an\u00A0\u2014 Dein Verm\u00F6gen bestimmt den Wert eines einzelnen Maiskorns."
        );
    }

    /** Parse a German-formatted number string (dots as thousands sep, comma as decimal) */
    function parseDe(str) {
        if (!str) return NaN;
        const cleaned = str.replace(/\./g, "").replace(",", ".");
        return parseFloat(cleaned);
    }

    /** Format a number in German locale for the input field (no decimals) */
    function formatInput(n) {
        return fmt.format(Math.round(n));
    }

    /** Smart unit formatting for mass */
    function formatMass(kg) {
        if (kg < 1) return fmt1.format(kg * 1000) + " g";
        if (kg < 1000) return fmt2.format(kg) + " kg";
        if (kg < 1e6) return fmt2.format(kg / 1000) + " t";
        return fmt1.format(kg / 1000) + " t";
    }

    /** Smart unit formatting for edge length */
    function formatLength(m) {
        if (m < 0.01) return fmt1.format(m * 1000) + " mm";
        if (m < 1) return fmt1.format(m * 100) + " cm";
        if (m < 1000) return fmt2.format(m) + " m";
        return fmt2.format(m / 1000) + " km";
    }

    /** Smart formatting for bathtubs */
    function formatBathtubs(n) {
        if (n < 10) return fmt2.format(n);
        if (n < 1000) return fmt1.format(n);
        if (n < 1e6) return fmt.format(n);
        return fmt1.format(n / 1e6) + " Mio.";
    }

    /** Smart formatting for corn count */
    function formatCount(n) {
        if (n < 1e6) return fmt.format(n);
        if (n < 1e9) return fmt1.format(n / 1e6) + " Mio.";
        if (n < 1e12) return fmt1.format(n / 1e9) + " Mrd.";
        return fmt1.format(n / 1e12) + " Bio.";
    }

    /** Format wealth value for display */
    function formatWealth(value) {
        if (value >= 1e9) return fmt1.format(value / 1e9) + "\u00A0Mrd.\u00A0€";
        if (value >= 1e6) return fmt1.format(value / 1e6) + "\u00A0Mio.\u00A0€";
        return fmt.format(value) + "\u00A0€";
    }

    // --- State accessors ---

    function getMyWealth() {
        return parseFloat(slider.value) || 1;
    }

    function getCompareWealth() {
        return _selectedCompareWealth || 0;
    }

    // --- Calculation ---

    function calculate() {
        const myWealth = getMyWealth();
        const compareW = getCompareWealth();

        if (myWealth <= 0 || compareW <= 0) {
            outCount.textContent = "–";
            outMass.textContent = "–";
            outEdge.textContent = "–";
            outBathtubs.textContent = "–";
            stepsContainer.innerHTML = '<em class="text-muted">Bitte Werte eingeben.</em>';
            resultSummary.innerHTML = "";
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
        const compareName = _selectedCompareName || "Die Vergleichsperson";
        resultSummary.innerHTML = "";
        const line1 = document.createElement("div");
        line1.className = "summary-line";
        line1.innerHTML = `Ein Maiskorn entspricht einem Vermögen von <strong>${formatWealth(myW)}</strong>.`;
        const line2 = document.createElement("div");
        line2.className = "summary-line mt-1";
        line2.innerHTML = `Das Vermögen von <strong></strong> (<strong>${formatWealth(compW)}</strong>) entspricht <strong>${formatCount(count)} Maiskörnern</strong>.`;
        line2.querySelector("strong").textContent = compareName;
        resultSummary.appendChild(line1);
        resultSummary.appendChild(line2);
    }

    // --- Rechenweg ---

    function renderSteps(myW, compW, count, massKg, volM3, edgeM, baths) {
        const fmtEur = (v) => fmt.format(v) + "\u00A0€";
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
          <code>${fmt2.format(count)} × (${TKM_GRAM} g ÷ 1.000) = ${fmt2.format((count * TKM_GRAM) / 1000)} g = ${formatMass(massKg)}</code>
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
        wealthDisplay.textContent = formatInput(val) + "\u00A0€";
    }

    function syncInputToSlider() {
        const val = parseDe(wealthInput.value);
        if (!isNaN(val) && val >= 1) {
            const clamped = Math.min(Math.max(Math.round(val), 1), 10000000);
            slider.value = clamped;
            wealthDisplay.textContent = formatInput(clamped) + "\u00A0€";
        }
    }

    function hideSplitError() {
        splitWealthError.textContent = "";
        splitWealthError.classList.add("d-none");
    }

    function showSplitError(message) {
        splitWealthError.textContent = message;
        splitWealthError.classList.remove("d-none");
    }

    function getMedianWealth() {
        return _selectedAgeGroup ? _selectedAgeGroup.medianWealth : _overallMedian;
    }

    function applyWealthSplit(divisor) {
        if (!Number.isFinite(divisor) || divisor <= 0) {
            showSplitError("Bitte gib eine Zahl größer als 0 ein.");
            return false;
        }

        const median = getMedianWealth();
        if (median == null) return false;
        const splitWealth = Math.min(Math.max(Math.round(median / divisor), 1), 10000000);
        slider.value = splitWealth;
        wealthInput.value = formatInput(splitWealth);
        wealthDisplay.textContent = formatInput(splitWealth) + "\u00A0€";
        hideSplitError();
        bootstrap.Modal.getInstance(splitWealthModalEl).hide();
        return true;
    }

    function updateSplitAmounts() {
        const median = getMedianWealth();
        [2, 3, 4].forEach((d) => {
            const el = document.getElementById("splitAmount" + d);
            if (el) {
                el.textContent = median != null ? formatWealth(Math.round(median / d)) : "–";
            }
        });
    }

    // --- Events ---

    slider.addEventListener("input", () => {
        syncSliderToInput();
    });

    wealthInput.addEventListener("input", () => {
        syncInputToSlider();
    });

    wealthInput.addEventListener("change", () => {
        const val = parseDe(wealthInput.value);
        if (!isNaN(val) && val >= 1) {
            slider.value = Math.min(Math.max(Math.round(val), 1), 10000000);
            wealthInput.value = formatInput(val);
            wealthDisplay.textContent = formatInput(val) + "\u00A0€";
        }
    });

    splitWealthButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const divisor = parseFloat(btn.dataset.divisor);
            applyWealthSplit(divisor);
        });
    });

    applySplitWealth.addEventListener("click", () => {
        const divisor = parseDe(splitWealthDivisor.value);
        applyWealthSplit(divisor);
    });

    splitWealthDivisor.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const divisor = parseDe(splitWealthDivisor.value);
        applyWealthSplit(divisor);
    });

    splitWealthDivisor.addEventListener("input", hideSplitError);

    if (splitWealthModalEl) {
        splitWealthModalEl.addEventListener("show.bs.modal", () => {
            updateSplitAmounts();
            splitWealthDivisor.value = "";
            hideSplitError();
        });
    }

    // --- Age group selection ---

    function selectAgeGroup(group, cardEl) {
        _selectedAgeGroup = group;
        _skippedAgeGroup = false;
        document.querySelectorAll(".age-group-card").forEach((c) => c.classList.remove("selected"));
        cardEl.classList.add("selected");

        // Pre-fill slider with median wealth
        const val = Math.min(Math.max(Math.round(group.medianWealth), 1), 10000000);
        slider.value = val;
        wealthInput.value = formatInput(val);
        wealthDisplay.textContent = formatInput(val) + "\u00A0€";

        // Update hint text using safe DOM methods
        setWealthDescription(group, group.medianWealth);

        showView("view-wealth");
    }

    function skipAgeGroupSelection(median) {
        _selectedAgeGroup = null;
        _skippedAgeGroup = true;
        document.querySelectorAll(".age-group-card").forEach((c) => c.classList.remove("selected"));

        const val = Math.min(Math.max(Math.round(median), 1), 10000000);
        slider.value = val;
        wealthInput.value = formatInput(val);
        wealthDisplay.textContent = formatInput(val) + "\u00A0€";

        // Update hint for skip path
        setWealthDescription(null, median);

        showView("view-wealth");
    }

    function renderAgeGroups(groups) {
        ageGroupGrid.innerHTML = "";
        groups.forEach((group) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "age-group-card";

            const labelDiv = document.createElement("div");
            labelDiv.className = "age-group-label";
            labelDiv.textContent = group.label;

            const medianDiv = document.createElement("div");
            medianDiv.className = "age-group-median";
            medianDiv.append("Haushalt-Median: ");
            const strong = document.createElement("strong");
            strong.textContent = formatWealth(group.medianWealth);
            medianDiv.appendChild(strong);

            card.appendChild(labelDiv);
            card.appendChild(medianDiv);
            card.addEventListener("click", () => selectAgeGroup(group, card));
            ageGroupGrid.appendChild(card);
        });
    }

    function renderSkipButton(group) {
        skipAgeGroupContainer.innerHTML = "";
        const card = document.createElement("button");
        card.type = "button";
        card.className = "age-group-card w-100";

        const labelDiv = document.createElement("div");
        labelDiv.className = "age-group-label";
        labelDiv.textContent = "Ohne Altersgruppe fortfahren";

        const medianDiv = document.createElement("div");
        medianDiv.className = "age-group-median";
        medianDiv.append("Gesamtmedian aller Haushalte in Deutschland: ");
        const strong = document.createElement("strong");
        strong.textContent = formatWealth(group.medianWealth);
        medianDiv.appendChild(strong);

        card.appendChild(labelDiv);
        card.appendChild(medianDiv);
        card.addEventListener("click", () => skipAgeGroupSelection(group.medianWealth));
        skipAgeGroupContainer.appendChild(card);
    }

    // --- Load wealthy list from YAML ---

    function selectCompareEntry(wealthEur, name) {
        _selectedCompareWealth = wealthEur;
        _selectedCompareName = name;
        calculate();
        showView("view-result");
    }

    function renderCompareGrid(entries) {
        compareGrid.innerHTML = "";
        entries.sort((a, b) => a.wealth - b.wealth);
        entries.forEach((entry) => {
            const wealthEur = entry.wealth * 1e9;
            const card = document.createElement("button");
            card.type = "button";
            card.className = "age-group-card";

            const labelDiv = document.createElement("div");
            labelDiv.className = "age-group-label";
            labelDiv.textContent = entry.name;

            const wealthDiv = document.createElement("div");
            wealthDiv.className = "age-group-median";
            wealthDiv.textContent = formatWealth(wealthEur);

            card.appendChild(labelDiv);
            card.appendChild(wealthDiv);
            card.addEventListener("click", () => selectCompareEntry(wealthEur, entry.name));
            compareGrid.appendChild(card);
        });
    }

    function appendCustomWealthCard() {
        const card = document.createElement("div");
        card.className = "age-group-card compare-custom";

        const labelDiv = document.createElement("div");
        labelDiv.className = "age-group-label";
        labelDiv.textContent = "Eigener Wert";

        const group = document.createElement("div");
        group.className = "input-group input-group-sm mt-1";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control text-end";
        input.inputMode = "decimal";
        input.id = "customWealth";
        input.setAttribute("aria-label", "Eigener Wert in Mrd. €");

        const suffix = document.createElement("span");
        suffix.className = "input-group-text";
        suffix.textContent = "Mrd.\u00A0\u20AC";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-corn";
        btn.setAttribute("aria-label", "Eigenen Wert vergleichen");
        btn.innerHTML = '<i class="bi bi-check-lg"></i>';
        btn.addEventListener("click", () => {
            const val = parseDe(input.value);
            if (!isNaN(val) && val > 0) {
                selectCompareEntry(val * 1e9, "Eigener Wert");
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                btn.click();
            }
        });

        group.appendChild(input);
        group.appendChild(suffix);
        group.appendChild(btn);
        card.appendChild(labelDiv);
        card.appendChild(group);
        compareGrid.appendChild(card);
    }

    // --- Data loading ---

    fetch("./age-groups.yaml")
        .then((r) => r.text())
        .then((t) => jsyaml.load(t))
        .then((data) => {
            const ageGroups = data.filter((g) => !g.skip);
            const skipGroup = data.find((g) => g.skip);
            renderAgeGroups(ageGroups);
            if (skipGroup) {
                _overallMedian = skipGroup.medianWealth;
                renderSkipButton(skipGroup);
            }
        })
        .catch(() => {
            ageGroupGrid.innerHTML = '<p class="text-danger">Fehler beim Laden der Altersgruppen.</p>';
        });

    fetch("./wealthy.yaml")
        .then((r) => r.text())
        .then((t) => jsyaml.load(t))
        .then((data) => {
            renderCompareGrid(data);
            appendCustomWealthCard();
        })
        .catch(() => {
            compareGrid.innerHTML = '<p class="text-danger">Fehler beim Laden der Vergleichsdaten.</p>';
        });

    // --- Initial ---
    document.getElementById("bathtubLiters").textContent = BATHTUB_LITERS;
    syncSliderToInput();
    showView("view-age");

    // --- Service Worker (skip on localhost to avoid stale caches during development) ---
    if (
        "serviceWorker" in navigator &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1" &&
        location.hostname !== "::1"
    ) {
        navigator.serviceWorker
            .register("./sw.js")
            .then((reg) => {
                reg.addEventListener("updatefound", () => {
                    const newSW = reg.installing;
                    newSW.addEventListener("statechange", () => {
                        if (newSW.state === "activated") location.reload();
                    });
                });
            })
            .catch(() => {});
    }
})();
