<template>
  <div class="min-h-full bg-bg pb-12">
    <!-- Header -->
    <header class="bg-surface shadow-soft sticky top-0 z-30">
      <div class="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-txt leading-tight">Altersvorsorgedepot</h1>
          <p class="text-xs text-txt-muted">Förderrechner 2027</p>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-6 space-y-6 animate-slide-up">
      <!-- Intro -->
      <div class="bg-gradient-to-br from-[#E5704A] to-primary rounded-3xl p-5 text-white shadow-glow">
        <h2 class="text-xl font-extrabold mb-2 drop-shadow-sm">Wie viel Förderung bekommen Sie?</h2>
        <p class="text-sm text-white/95 leading-relaxed drop-shadow-sm">
          Ab 2027 ersetzt das Altersvorsorgedepot die Riester-Rente. Berechnen Sie jetzt Ihre staatliche Zulage und den Steuervorteil.
        </p>
      </div>

      <!-- Eingabe -->
      <div class="bg-surface rounded-3xl p-5 shadow-soft space-y-5">
        <h3 class="text-base font-extrabold text-txt">Ihre Angaben</h3>

        <!-- Bruttoeinkommen -->
        <div>
          <label class="block text-xs font-bold text-txt-muted mb-2">Jährliches Bruttoeinkommen (€)</label>
          <input
            v-model.number="brutto"
            type="number"
            class="w-full bg-bg rounded-2xl px-4 py-3.5 text-sm font-bold text-txt outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="z.B. 45000"
          />
        </div>

        <!-- Kinder -->
        <div>
          <label class="block text-xs font-bold text-txt-muted mb-2">Anzahl förderberechtigter Kinder</label>
          <div class="flex items-center gap-3">
            <button
              v-for="n in 5"
              :key="n - 1"
              class="w-12 h-12 rounded-2xl text-sm font-extrabold transition-all"
              :class="kinder === n - 1 ? 'bg-primary text-white shadow-glow' : 'bg-bg text-txt-muted'"
              @click="kinder = n - 1"
            >
              {{ n - 1 }}
            </button>
          </div>
        </div>

        <!-- Monatlicher Beitrag -->
        <div>
          <label class="block text-xs font-bold text-txt-muted mb-2">Monatlicher Eigenbeitrag (€)</label>
          <input
            v-model.number="monatlicherBeitrag"
            type="range"
            min="10"
            max="500"
            step="5"
            class="w-full accent-primary mb-2"
          />
          <div class="flex items-center justify-between">
            <span class="text-xs text-txt-muted">10 €</span>
            <span class="text-lg font-extrabold text-primary">{{ monatlicherBeitrag }} €</span>
            <span class="text-xs text-txt-muted">500 €</span>
          </div>
          <p class="text-xs text-txt-muted mt-1">Empfohlen: mindestens 150 €/Monat für volle Grundzulage</p>
        </div>

        <!-- Anlagedauer -->
        <div>
          <label class="block text-xs font-bold text-txt-muted mb-2">Anlagedauer (Jahre)</label>
          <input
            v-model.number="jahre"
            type="range"
            min="5"
            max="40"
            step="1"
            class="w-full accent-secondary mb-2"
          />
          <div class="flex items-center justify-between">
            <span class="text-xs text-txt-muted">5 J.</span>
            <span class="text-lg font-extrabold text-secondary">{{ jahre }} Jahre</span>
            <span class="text-xs text-txt-muted">40 J.</span>
          </div>
        </div>

        <!-- Rendite -->
        <div>
          <label class="block text-xs font-bold text-txt-muted mb-2">Erwartete Jahresrendite (%)</label>
          <input
            v-model.number="rendite"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="w-full accent-success mb-2"
          />
          <div class="flex items-center justify-between">
            <span class="text-xs text-txt-muted">1 %</span>
            <span class="text-lg font-extrabold text-success">{{ rendite }} %</span>
            <span class="text-xs text-txt-muted">10 %</span>
          </div>
        </div>
      </div>

      <!-- Ergebnisse -->
      <div class="bg-surface rounded-3xl p-5 shadow-soft space-y-5">
        <h3 class="text-base font-extrabold text-txt">Ihre Förderung pro Jahr</h3>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-bg rounded-2xl p-4 text-center">
            <div class="text-2xl font-extrabold text-primary">{{ formatEuro(ergebnis.grundzulage) }}</div>
            <div class="text-xs text-txt-muted mt-1">Grundzulage</div>
          </div>
          <div class="bg-bg rounded-2xl p-4 text-center">
            <div class="text-2xl font-extrabold text-secondary">{{ formatEuro(ergebnis.kinderzulage) }}</div>
            <div class="text-xs text-txt-muted mt-1">Kinderzulage</div>
          </div>
        </div>

        <div class="bg-bg rounded-2xl p-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-bold text-txt">Geschätzter Steuervorteil</span>
            <span class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.steuerVorteil) }}</span>
          </div>
          <p class="text-xs text-txt-muted">Basierend auf Ihrem Grenzsteuersatz von ca. {{ (ergebnis.grenzSteuerSatz * 100).toFixed(0) }}%</p>
        </div>

        <div class="border-t border-bg pt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-txt">Staatliche Förderung gesamt</span>
            <span class="text-2xl font-extrabold text-success">{{ formatEuro(ergebnis.forderungGesamt) }}</span>
          </div>
          <p class="text-xs text-txt-muted">Zulagen + Steuervorteil pro Jahr</p>
        </div>
      </div>

      <!-- Langfrist-Vergleich -->
      <div class="bg-surface rounded-3xl p-5 shadow-soft space-y-5">
        <h3 class="text-base font-extrabold text-txt">Langfristiger Vergleich ({{ jahre }} Jahre)</h3>

        <!-- Mit Förderung -->
        <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-4 border border-success/20">
          <div class="text-xs font-bold text-success mb-1">Mit Altersvorsorgedepot</div>
          <div class="text-3xl font-extrabold text-txt">{{ formatEuro(ergebnis.kapitalMitForderung) }}</div>
          <div class="text-xs text-txt-muted mt-1">
            Eigene Einzahlung: {{ formatEuro(ergebnis.eigenEinzahlungGesamt) }} · Förderung: {{ formatEuro(ergebnis.forderungGesamt * jahre) }}
          </div>
        </div>

        <!-- Ohne Förderung -->
        <div class="bg-bg rounded-2xl p-4">
          <div class="text-xs font-bold text-txt-muted mb-1">Privater ETF-Sparplan (ohne Förderung)</div>
          <div class="text-3xl font-extrabold text-txt">{{ formatEuro(ergebnis.kapitalOhneForderung) }}</div>
          <div class="text-xs text-txt-muted mt-1">Nur eigene Einzahlung mit gleicher Rendite</div>
        </div>

        <!-- Differenz -->
        <div class="flex items-center gap-3 bg-primary/5 rounded-2xl p-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-bold text-txt">Ihr Förder-Vorteil</div>
            <div class="text-xl font-extrabold text-primary">+ {{ formatEuro(ergebnis.differenz) }}</div>
            <div class="text-xs text-txt-muted">mehr durch staatliche Förderung</div>
          </div>
        </div>
      </div>

      <!-- Altes vs. Neues System -->
      <div class="bg-surface rounded-3xl p-5 shadow-soft space-y-5">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <h3 class="text-base font-extrabold text-txt">Alt vs. Neu im Vergleich</h3>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Altes Riester -->
          <div class="bg-bg rounded-2xl p-4 space-y-3">
            <div class="text-xs font-bold text-txt-muted uppercase tracking-wide">Altes Riester</div>
            <div>
              <div class="text-xs text-txt-muted">Grundzulage</div>
              <div class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.alt.grundzulage) }}</div>
            </div>
            <div>
              <div class="text-xs text-txt-muted">Kinderzulage</div>
              <div class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.alt.kinderzulage) }}</div>
            </div>
            <div>
              <div class="text-xs text-txt-muted">Gesamtförderung/Jahr</div>
              <div class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.alt.forderungGesamt) }}</div>
            </div>
            <div class="pt-2 border-t border-surface">
              <div class="text-xs text-txt-muted">Jährliche Kosten</div>
              <div class="text-sm font-bold text-danger">{{ formatEuro(ergebnis.alt.kostenJahr) }}</div>
              <div class="text-[10px] text-txt-muted">ca. 1,5% p.a. (Versicherung)</div>
            </div>
          </div>

          <!-- Neues Depot -->
          <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-4 space-y-3 border border-success/20">
            <div class="text-xs font-bold text-success uppercase tracking-wide">Neues Depot</div>
            <div>
              <div class="text-xs text-txt-muted">Grundzulage</div>
              <div class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.neu.grundzulage) }}</div>
            </div>
            <div>
              <div class="text-xs text-txt-muted">Kinderzulage</div>
              <div class="text-lg font-extrabold text-txt">{{ formatEuro(ergebnis.neu.kinderzulage) }}</div>
            </div>
            <div>
              <div class="text-xs text-txt-muted">Gesamtförderung/Jahr</div>
              <div class="text-lg font-extrabold text-success">{{ formatEuro(ergebnis.neu.forderungGesamt) }}</div>
            </div>
            <div class="pt-2 border-t border-success/20">
              <div class="text-xs text-txt-muted">Jährliche Kosten</div>
              <div class="text-sm font-bold text-success">{{ formatEuro(ergebnis.neu.kostenJahr) }}</div>
              <div class="text-[10px] text-txt-muted">ca. 0,3% p.a. (ETF-Depot)</div>
            </div>
          </div>
        </div>

        <!-- Gewinner -->
        <div
          class="rounded-2xl p-4 text-center"
          :class="ergebnis.vergleichGewinner === 'neu' ? 'bg-success/10 border border-success/20' : ergebnis.vergleichGewinner === 'alt' ? 'bg-bg' : 'bg-bg'"
        >
          <div class="text-xs font-bold text-txt-muted mb-1">
            {{ ergebnis.vergleichGewinner === 'gleich' ? 'Kein Unterschied' : 'Besser für Sie:' }}
          </div>
          <div
            class="text-xl font-extrabold"
            :class="ergebnis.vergleichGewinner === 'neu' ? 'text-success' : ergebnis.vergleichGewinner === 'alt' ? 'text-txt' : 'text-txt-muted'"
          >
            {{ ergebnis.vergleichGewinner === 'neu' ? 'Neues Depot' : ergebnis.vergleichGewinner === 'alt' ? 'Altes Riester' : 'Beide gleich' }}
          </div>
          <div class="text-xs text-txt-muted mt-1">
            Unterschied nach {{ jahre }} Jahren: {{ formatEuro(Math.abs(ergebnis.vergleichDifferenz)) }}
          </div>
        </div>

        <!-- Details -->
        <div class="bg-bg rounded-2xl p-4 space-y-2">
          <div class="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" class="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <p class="text-xs text-txt-muted leading-relaxed">
              <strong class="text-txt">Flexibilität:</strong> Das neue Depot erlaubt Kapitalauszahlung statt Zwangsurnte. Außerdem fallen ETF-Depots deutlich günstiger aus als klassische Riester-Versicherungen.
            </p>
          </div>
          <div class="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" class="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <p class="text-xs text-txt-muted leading-relaxed">
              <strong class="text-txt">Kinderzulage:</strong> Beim alten Riester gab es die volle Kinderzulage (300 €) auch bei niedrigem Eigenbeitrag. Beim neuen Depot ist sie anteilig gekoppelt an den eigenen Beitrag.
            </p>
          </div>
        </div>
      </div>

      <!-- Hinweise -->
      <div class="bg-bg rounded-2xl p-4 space-y-2">
        <p class="text-xs text-txt-muted leading-relaxed">
          <strong class="text-txt">Hinweis:</strong> Dieser Rechner stellt eine vereinfachte Schätzung dar. Die tatsächliche Förderung hängt von Ihrem individuellen Steuersatz, weiteren Altersvorsorgeverträgen und den konkreten Kosten des Depot-Anbieters ab. Bei vorzeitiger Entnahme müssen Zulagen zurückgezahlt werden (förderschädliche Verwendung).
        </p>
        <p class="text-xs text-txt-muted leading-relaxed">
          Stand: Mai 2026 auf Basis der Bundestagsbeschlüsse vom 27.03.2026.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const brutto = ref(45000)
const kinder = ref(2)
const monatlicherBeitrag = ref(150)
const jahre = ref(25)
const rendite = ref(5)

function formatEuro(n: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

// Vereinfachte Grenzsteuerberechnung (Grundtarif 2024)
function getGrenzSteuerSatz(einkommen: number): number {
  if (einkommen <= 11604) return 0
  if (einkommen <= 17005) return 0.14 + ((einkommen - 11604) / (17005 - 11604)) * 0.10
  if (einkommen <= 66760) return 0.24 + ((einkommen - 17005) / (66760 - 17005)) * 0.18
  if (einkommen <= 277825) return 0.42
  return 0.45
}

const ergebnis = computed(() => {
  const eigenJahr = monatlicherBeitrag.value * 12
  const grenzSteuerSatz = getGrenzSteuerSatz(brutto.value)

  // === NEUES SYSTEM (Altersvorsorgedepot) ===
  // Grundzulage: 50% auf erste 360€, 25% auf 361-1800€
  let grundzulageNeu = 0
  if (eigenJahr >= 120) {
    const erste360 = Math.min(eigenJahr, 360)
    const rest = Math.max(0, Math.min(eigenJahr, 1800) - 360)
    grundzulageNeu = erste360 * 0.50 + rest * 0.25
    grundzulageNeu = Math.min(grundzulageNeu, 540)
  }

  // Kinderzulage: max 300€ pro Kind, anteilig ab 120€
  let kinderzulageNeu = 0
  if (kinder.value > 0 && eigenJahr >= 120) {
    const kzProKind = Math.min(300, Math.max(120, eigenJahr))
    kinderzulageNeu = kzProKind * kinder.value
  }

  const steuerVorteilNeu = eigenJahr * grenzSteuerSatz
  const forderungGesamtNeu = grundzulageNeu + kinderzulageNeu + steuerVorteilNeu

  // Kosten neu (ETF-Depot, ca. 0,3% p.a. auf das angesparte Kapital)
  // Vereinfacht: Kosten auf Eigenbeitrag + Zulagen pro Jahr
  const kostenJahrNeu = (eigenJahr + grundzulageNeu + kinderzulageNeu) * 0.003

  // === ALTES SYSTEM (Riester) ===
  // Grundzulage: 175 €/Jahr (bei Mindesteigenbeitrag 60 €/Jahr)
  let grundzulageAlt = 0
  if (eigenJahr >= 60) {
    grundzulageAlt = 175
  }

  // Kinderzulage: 300 € pro Kind/Jahr (voll, wenn Mindestbeitrag erfüllt)
  let kinderzulageAlt = 0
  if (kinder.value > 0 && eigenJahr >= 60) {
    kinderzulageAlt = 300 * kinder.value
  }

  const steuerVorteilAlt = eigenJahr * grenzSteuerSatz
  const forderungGesamtAlt = grundzulageAlt + kinderzulageAlt + steuerVorteilAlt

  // Kosten alt (klassische Riester-Versicherung, ca. 1,5% p.a.)
  const kostenJahrAlt = (eigenJahr + grundzulageAlt + kinderzulageAlt) * 0.015

  // === KAPITALVERGLEICH ===
  const r = rendite.value / 100

  // Neu: mit Kostenabzug
  const einzahlungNeuNetto = eigenJahr + grundzulageNeu + kinderzulageNeu - kostenJahrNeu
  const kapitalNeu = berechneKapital(einzahlungNeuNetto, r, jahre.value)

  // Alt: mit höheren Kosten
  const einzahlungAltNetto = eigenJahr + grundzulageAlt + kinderzulageAlt - kostenJahrAlt
  const kapitalAlt = berechneKapital(einzahlungAltNetto, r, jahre.value)

  // Ohne Förderung (nur eigene Einzahlung, keine Kosten)
  const kapitalOhne = berechneKapital(eigenJahr, r, jahre.value)

  // Vergleich
  const vergleichDifferenz = kapitalNeu - kapitalAlt
  let vergleichGewinner: 'neu' | 'alt' | 'gleich'
  if (vergleichDifferenz > 100) vergleichGewinner = 'neu'
  else if (vergleichDifferenz < -100) vergleichGewinner = 'alt'
  else vergleichGewinner = 'gleich'

  return {
    grundzulage: grundzulageNeu,
    kinderzulage: kinderzulageNeu,
    steuerVorteil: steuerVorteilNeu,
    grenzSteuerSatz,
    forderungGesamt: forderungGesamtNeu,
    eigenEinzahlungGesamt: eigenJahr * jahre.value,
    kapitalMitForderung: kapitalNeu,
    kapitalOhneForderung: kapitalOhne,
    differenz: kapitalNeu - kapitalOhne,
    neu: {
      grundzulage: grundzulageNeu,
      kinderzulage: kinderzulageNeu,
      forderungGesamt: forderungGesamtNeu,
      kostenJahr: kostenJahrNeu,
    },
    alt: {
      grundzulage: grundzulageAlt,
      kinderzulage: kinderzulageAlt,
      forderungGesamt: forderungGesamtAlt,
      kostenJahr: kostenJahrAlt,
    },
    vergleichGewinner,
    vergleichDifferenz,
  }
})

function berechneKapital(jahrlicheEinzahlung: number, zins: number, jahre: number): number {
  if (zins === 0) return jahrlicheEinzahlung * jahre
  // Jährliche Einzahlung am Jahresende
  return jahrlicheEinzahlung * ((Math.pow(1 + zins, jahre) - 1) / zins)
}
</script>
