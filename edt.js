// =====================
// Emploi du temps - Page index.html
// =====================

let allEvents = [];
let availableWeeks = [];
let selectedWeekIndex = 0;
let selectedDay = null;

const PALETTE = ["#007bff", "#17a2b8", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#fd7e14", "#e83e8c", "#20c997", "#6610f2", "#0dcaf0", "#adb5bd"];

// DOM Elements
const loadingScreen = document.getElementById("loading-screen");
const app = document.getElementById("app");
const currentDateEl = document.getElementById("current-date");
const icsStatus = document.getElementById("icsStatus");
const prevWeekBtn = document.getElementById("prevWeek");
const nextWeekBtn = document.getElementById("nextWeek");
const weekLabelEl = document.getElementById("weekLabel");
const weekDatesEl = document.getElementById("weekDates");
const daySelectorEl = document.getElementById("daySelector");
const sumCoursesEl = document.getElementById("sumCourses");
const sumHoursEl = document.getElementById("sumHours");
const sumDaysEl = document.getElementById("sumDays");

// =====================
// Init
// =====================
document.addEventListener("DOMContentLoaded", () => {
  // Date du jour
  const now = new Date();
  if (currentDateEl) {
    currentDateEl.textContent = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  // Loading -> app
  setTimeout(() => {
    loadingScreen?.classList.add("hidden");
    app?.classList.remove("hidden");
  }, 400);

  // Prev/Next week
  prevWeekBtn?.addEventListener("click", () => changeWeek(-1));
  nextWeekBtn?.addEventListener("click", () => changeWeek(+1));

  // Auto load ./edt.ics
  loadIcsFromServer();
});

// =====================
// iCal auto load
// =====================
async function loadIcsFromServer() {
  try {
    setStatus("Chargement de edt.ics…");
    const res = await fetch("./edt.ics", { cache: "no-store" });

    if (!res.ok) {
      setStatus("edt.ics introuvable. Vérifie qu'il est bien dans le dossier.", true);
      allEvents = [];
      availableWeeks = [];
      selectedDay = null;
      renderAll();
      return;
    }

    const text = await res.text();
    loadFromIcsText(text, "edt.ics chargé ✅");
  } catch (e) {
    console.error(e);
    setStatus("Erreur de lecture edt.ics.", true);
    allEvents = [];
    availableWeeks = [];
    selectedDay = null;
    renderAll();
  }
}

function loadFromIcsText(icsText, okMsg) {
  try {
    allEvents = parseWithIcalJs(icsText);
    setStatus(`${okMsg} — ${allEvents.length} événement(s)`);
    buildAvailableWeeks();
    pickInitialWeekAndDay();
    renderAll();
  } catch (err) {
    console.error(err);
    setStatus("Impossible de parser le fichier .ics.", true);
    allEvents = [];
    availableWeeks = [];
    selectedDay = null;
    renderAll();
  }
}

// ========== Parsing (ical.js) ==========
function parseWithIcalJs(icsText) {
  if (!window.ICAL) throw new Error("ical.js n'est pas chargé.");

  const jcalData = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  const out = [];

  for (const ve of vevents) {
    const ev = new ICAL.Event(ve);
    const title = ev.summary || "Événement";
    const room = (ev.location || "").trim();

    if (ev.isRecurring()) {
      const startRange = new Date();
      startRange.setDate(startRange.getDate() - 30);
      const endRange = new Date();
      endRange.setDate(endRange.getDate() + 180);

      const it = ev.iterator(ICAL.Time.fromJSDate(startRange, false));
      while (true) {
        const next = it.next();
        if (!next) break;

        const occStart = next.toJSDate();
        if (occStart > endRange) break;

        const occEnd = ev.getOccurrenceDetails(next).endDate.toJSDate();
        out.push(toEventObj(title, room, occStart, occEnd));
      }
    } else {
      const start = ev.startDate.toJSDate();
      const end = ev.endDate.toJSDate();
      out.push(toEventObj(title, room, start, end));
    }
  }

  out.sort((a, b) => a.start - b.start);
  return out;
}

function toEventObj(title, room, start, end) {
  const weekKey = isoWeekKeyFromLocalDate(start);
  const color = PALETTE[hashString(title) % PALETTE.length];
  return { title, room, start, end, weekKey, color };
}

// ========== Weeks ==========
function buildAvailableWeeks() {
  const set = new Set(allEvents.map((e) => e.weekKey));
  availableWeeks = Array.from(set).sort();
  selectedWeekIndex = Math.min(selectedWeekIndex, Math.max(0, availableWeeks.length - 1));
}

function pickInitialWeekAndDay() {
  if (!availableWeeks.length) {
    selectedDay = null;
    selectedWeekIndex = 0;
    return;
  }

  const now = new Date();
  const next = allEvents.find((e) => e.end >= now) || allEvents[0];
  const wk = next.weekKey;

  const idx = availableWeeks.indexOf(wk);
  selectedWeekIndex = idx >= 0 ? idx : 0;

  selectedDay = startOfLocalDay(next.start);
  if (isoWeekKeyFromLocalDate(selectedDay) !== availableWeeks[selectedWeekIndex]) {
    selectedDay = startOfLocalDay(mondayOfWeekKey(availableWeeks[selectedWeekIndex]));
  }
}

function changeWeek(delta) {
  if (!availableWeeks.length) return;

  const ni = selectedWeekIndex + delta;
  if (ni < 0 || ni >= availableWeeks.length) return;

  selectedWeekIndex = ni;
  selectedDay = startOfLocalDay(mondayOfWeekKey(availableWeeks[selectedWeekIndex]));
  renderAll();
}

// ========== Render EDT ==========
function renderAll() {
  renderWeekBar();
  renderDaySelector();
  renderSchedule();
  updateWeekButtons();
  updateSummary();
}

function renderWeekBar() {
  if (!availableWeeks.length) {
    weekLabelEl.textContent = "Semaine";
    weekDatesEl.textContent = "";
    return;
  }

  const wk = availableWeeks[selectedWeekIndex];
  const monday = mondayOfWeekKey(wk);
  const sunday = addDaysLocal(monday, 6);

  const weekNo = Number(wk.split("-W")[1]);
  weekLabelEl.textContent = `Semaine ${weekNo}`;

  const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  weekDatesEl.textContent = `${fmt(monday)} → ${fmt(sunday)}`;
}

function renderDaySelector() {
  daySelectorEl.innerHTML = "";
  if (!availableWeeks.length) return;

  const wk = availableWeeks[selectedWeekIndex];
  const monday = mondayOfWeekKey(wk);
  const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  for (let i = 0; i < 7; i++) {
    const d = addDaysLocal(monday, i);
    const btn = document.createElement("button");
    btn.className = "day-btn" + (sameLocalDay(d, selectedDay) ? " active" : "");
    btn.innerHTML = `${labels[i]}<br><small>${d.getDate()}/${d.getMonth() + 1}</small>`;
    btn.addEventListener("click", () => {
      selectedDay = startOfLocalDay(d);
      renderDaySelector();
      renderSchedule();
      updateSummary();
    });
    daySelectorEl.appendChild(btn);
  }
}

function renderSchedule() {
  const container = document.getElementById("schedule-list");

  if (!availableWeeks.length || !selectedDay) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>Aucun événement chargé.</p>
      </div>`;
    return;
  }

  const wk = availableWeeks[selectedWeekIndex];

  const items = allEvents
    .filter((e) => e.weekKey === wk)
    .filter((e) => sameLocalDay(e.start, selectedDay))
    .sort((a, b) => a.start - b.start);

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🕒</div>
        <p>Aucun cours ce jour-là.</p>
      </div>`;
    return;
  }

  const now = new Date();
  container.innerHTML = items
    .map((ev) => {
      const isCurrent = now >= ev.start && now <= ev.end;
      return `
        <div class="schedule-card ${isCurrent ? "current" : ""}">
          ${isCurrent ? `<span class="current-badge">En cours</span>` : ""}
          <span class="time-badge" style="background:${ev.color}">
            ${formatHHMM(ev.start)} - ${formatHHMM(ev.end)}
          </span>
          <h3>${escapeHtml(ev.title)}</h3>
          ${ev.room ? `<div class="schedule-info"><span>📍 ${escapeHtml(ev.room)}</span></div>` : ""}
        </div>
      `;
    })
    .join("");
}

function updateWeekButtons() {
  if (!availableWeeks.length) {
    prevWeekBtn.disabled = true;
    nextWeekBtn.disabled = true;
    return;
  }
  prevWeekBtn.disabled = selectedWeekIndex <= 0;
  nextWeekBtn.disabled = selectedWeekIndex >= availableWeeks.length - 1;
  prevWeekBtn.style.opacity = prevWeekBtn.disabled ? "0.5" : "1";
  nextWeekBtn.style.opacity = nextWeekBtn.disabled ? "0.5" : "1";
}

function updateSummary() {
  if (!sumCoursesEl || !sumHoursEl || !sumDaysEl) return;

  if (!availableWeeks.length) {
    sumCoursesEl.textContent = "0";
    sumHoursEl.textContent = "0h";
    sumDaysEl.textContent = "0";
    return;
  }

  const wk = availableWeeks[selectedWeekIndex];
  const weekEvents = allEvents.filter((e) => e.weekKey === wk);

  sumCoursesEl.textContent = String(weekEvents.length);

  let minutes = 0;
  for (const e of weekEvents) {
    const diff = (e.end - e.start) / 60000;
    if (Number.isFinite(diff) && diff > 0) minutes += diff;
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  sumHoursEl.textContent = `${hours}h`;

  const daySet = new Set(
    weekEvents.map((e) => `${e.start.getFullYear()}-${e.start.getMonth()}-${e.start.getDate()}`)
  );
  sumDaysEl.textContent = String(daySet.size);
}

// =====================
// Helpers
// =====================
function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function sameLocalDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function addDaysLocal(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isoWeekKeyFromLocalDate(date) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const utc = new Date(Date.UTC(y, m, d, 12, 0, 0));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const weekYear = utc.getUTCFullYear();

  const yearStart = new Date(Date.UTC(weekYear, 0, 1, 12, 0, 0));
  const yearStartDay = yearStart.getUTCDay() || 7;
  const firstThursday = new Date(yearStart);
  firstThursday.setUTCDate(firstThursday.getUTCDate() + (4 - yearStartDay));

  const weekNo = 1 + Math.floor((utc - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  return `${weekYear}-W${String(weekNo).padStart(2, "0")}`;
}

function mondayOfWeekKey(weekKey) {
  const [yy, ww] = weekKey.split("-W");
  const year = Number(yy);
  const week = Number(ww);

  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const mondayWeek1 = new Date(year, 0, 4 - (jan4Day - 1));
  const monday = new Date(mondayWeek1);
  monday.setDate(monday.getDate() + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatHHMM(d) {
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function setStatus(msg, isError = false) {
  return;  
}
