// =====================
// Paramètres - Page parametres.html
// =====================

// DOM
const loadingScreen = document.getElementById("loading-screen");
const app = document.getElementById("app");
const currentDateEl = document.getElementById("current-date");

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
  }, 300);
});

// =====================
// Toggle sections
// =====================
function toggleSection(section) {
  const content = document.getElementById(section + "-content");
  const chevron = document.getElementById(section + "-chevron");
  
  if (!content || !chevron) return;
  
  content.classList.toggle("open");
  chevron.classList.toggle("rotated");
}
