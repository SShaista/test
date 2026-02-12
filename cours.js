// cours.js

// =====================
// Cours (UE/ECUE) - Page cours.html
// =====================

let selectedSemester = "all";

const ueData = window.ueData || [
  // =====================
  // SEMESTRE 1
  // =====================
  {
    id: "ue11",
    semester: 1,
    title: "UE11 - Homogénéisation en sciences pour l'ingénieur",
    code: "UE11",
    ecues: [
      { id: "ecue111", name: "Mathématiques appliquées", code: "ECUE111", teacher: "M. Durand", description: "" },
      { id: "ecue112", name: "Physique et Applications", code: "ECUE112", teacher: "M. Bouaba", description: "" },
      { id: "ecue113", name: "Modélisation pour la conception (UML)", code: "ECUE113", teacher: "Mme Oubekkou", description: "" },
      { id: "ecue114", name: "Algorithmique", code: "ECUE114", teacher: "M. Abreu", description: "" },
      { id: "ecue115", name: "Initiation aux systèmes : Linux & shell", code: "ECUE115", teacher: "M. Diaz", description: "" },
    ],
  },
  {
    id: "ue12",
    semester: 1,
    title: "UE12 - Sciences pour l'ingénieur I",
    code: "UE12",
    ecues: [
      { id: "ecue121", name: "Physique numérique", code: "ECUE121", teacher: "M. Fried", description: "" },
      { id: "ecue122", name: "Introduction à la programmation", code: "ECUE122", teacher: "M. Haddad", description: "" },
    ],
  },
  {
    id: "ue13",
    semester: 1,
    title: "UE13 - Ouverture Scientifique Pluridisciplinaire I",
    code: "UE13",
    ecues: [
      { id: "ecue131", name: "Le monde de la santé et sa sémantique", code: "ECUE131", teacher: "M. Dubois", description: "" },
      { id: "ecue132", name: "Histoire des sciences et de l'industrie", code: "ECUE132", teacher: "Mme Benichou", description: "" },
    ],
  },
  {
    id: "ue14",
    semester: 1,
    title: "UE14 - Technologies I",
    code: "UE14",
    ecues: [
      { id: "ecue141", name: "Initiation réseau (protocoles et services)", code: "ECUE141", teacher: "M. Diaz", description: "" },
      { id: "ecue142", name: "Introduction aux réseaux hospitaliers (architectures)", code: "ECUE142", teacher: "M. Hoceini", description: "" },
      { id: "ecue143", name: "Métrologie, capteurs et signaux physiologiques", code: "ECUE143", teacher: "M. Haddad", description: "" },
      { id: "ecue144", name: "Méthodes de représentation pour le contrôle / commande", code: "ECUE144", teacher: "Mme Paresys", description: "" },
    ],
  },
  {
    id: "ue15",
    semester: 1,
    title: "UE15 - Communication et professionnalisation I",
    code: "UE15",
    ecues: [
      { id: "ecue151", name: "Anglais : Communication at work / Presenting Scientific contents", code: "ECUE151", teacher: "Mme Camerlynck", description: "" },
      { id: "ecue152", name: "Dynamique de groupe et communication", code: "ECUE152", teacher: "M. Dartiguepeyrou", description: "" },
      { id: "ecue153", name: "Les entreprises dans leur écosystème", code: "ECUE153", teacher: "M. Perdriel", description: "" },
    ],
  },
  {
    id: "ue16",
    semester: 1,
    title: "UE16 - Expérience en entreprise",
    code: "UE16",
    ecues: [
      { id: "ue161", name: "Rapport semestriel activités en entreprise", code: "UE161", teacher: "M. Hoceini", description: "" },
      { id: "ue162", name: "Rapports alternance entreprise", code: "UE162", teacher: "M. Mellouk", description: "" },
    ],
  },

  // =====================
  // SEMESTRE 2
  // =====================
  {
    id: "ue21",
    semester: 2,
    title: "UE21 - Sciences pour l'ingénieur II",
    code: "UE21",
    ecues: [
      { id: "ecue211", name: "Mathématiques pour l'ingénieur", code: "ECUE211", teacher: "M. Durand", description: "" },
      { id: "ecue212", name: "Acquisition, Traitement et Modélisation statistique des données physiologiques", code: "ECUE212", teacher: "M. Fournier", description: "" },
    ],
  },
  {
    id: "ue22",
    semester: 2,
    title: "UE22 - Ouverture Scientifique Pluridisciplinaire II",
    code: "UE22",
    ecues: [
      { id: "ecue221", name: "Approche biosociologique du monde de la santé", code: "ECUE221", teacher: "M. Lustman", description: "" },
      { id: "ecue222", name: "Philosophie des sciences : Imaginaire et société / Sociologie de la Technologie", code: "ECUE222", teacher: "Mme Benichou", description: "" },
    ],
  },
  {
    id: "ue23",
    semester: 2,
    title: "UE23 - Technologies II",
    code: "UE23",
    ecues: [
      { id: "ecue231", name: "Administration des services et systèmes", code: "ECUE231", teacher: "M. Hoceini", description: "" },
      { id: "ecue232", name: "Interconnexion et réseaux d'accès", code: "ECUE232", teacher: "M. Diaz", description: "" },
      { id: "ecue233", name: "Initiation aux technologies réseaux sans fil pour la santé", code: "ECUE233", teacher: "M. Hoceini", description: "" },
      { id: "ecue234", name: "Introduction à la programmation objet", code: "ECUE234", teacher: "M. Abreu", description: "" },
      { id: "ecue235", name: "Conception des interfaces homme-machine pour les systèmes d'aide", code: "ECUE235", teacher: "M. Abreu", description: "" },
      { id: "ecue236", name: "Introduction aux bases de données pour la santé, SQL", code: "ECUE236", teacher: "M. Diaz", description: "" },
    ],
  },
  {
    id: "ue24",
    semester: 2,
    title: "UE24 - Communication et professionnalisation II",
    code: "UE24",
    ecues: [
      { id: "ecue241", name: "Anglais : Science and Healthcare / relationships and company organisation", code: "ECUE241", teacher: "Mme Camerlynck", description: "" },
      { id: "ecue242", name: "Le risque sociétal dans le métier de l'ingénieur", code: "ECUE242", teacher: "M. Simard", description: "" },
      { id: "ecue243", name: "Conduite et Optimisation", code: "ECUE243", teacher: "M. Diaz", description: "" },
      { id: "ecue244", name: "Méthodologie scientifique & Innovations (1)", code: "ECUE244", teacher: "M. Mellouk", description: "" },
    ],
  },
  {
    id: "ue25",
    semester: 2,
    title: "UE25 - Expérience en entreprise",
    code: "UE25",
    ecues: [
      { id: "ue251", name: "Rapport semestriel activités en entreprise", code: "UE251", teacher: "M. Hoceini", description: "" },
      { id: "ue252", name: "Rapports alternances entreprise", code: "UE252", teacher: "M. Mellouk", description: "" },
    ],
  },
];

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

  // Setup filter
  setupFilterSelector();
  renderCourses();
});

// =====================
// Filtres
// =====================
function setupFilterSelector() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSemester = btn.dataset.semester || "all";
      renderCourses();
    });
  });
}

// =====================
// Render Cours (sans ECTS)
// =====================
function renderCourses() {
  const container = document.getElementById("courses-list");
  if (!container) return;

  const sem = selectedSemester;

  const filteredUEs =
    sem === "all"
      ? ueData
      : ueData.filter((ue) => ue.semester === parseInt(sem, 10));

  const totalUE = filteredUEs.length;
  const totalECUE = filteredUEs.reduce((acc, ue) => acc + ue.ecues.length, 0);

  const cEl = document.getElementById("coursesCount");
  const uEl = document.getElementById("uesCount");
  if (cEl) cEl.textContent = String(totalECUE);
  if (uEl) uEl.textContent = String(totalUE);

  if (!filteredUEs.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <p>Aucun cours pour ce semestre.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredUEs
    .map((ue) => {
      return `
        <div class="ue-card">
          <div class="ue-header">
            <div>
              <div class="ue-code">${escapeHtml(ue.code || "")}</div>
              <h3 class="ue-title">${escapeHtml(ue.title)}</h3>
            </div>
          </div>

          <div class="ue-content">
            ${ue.ecues
              .map(
                (ecue) => `
              <div class="ecue-item">
                <div class="ecue-name"><strong>${escapeHtml(ecue.name)}</strong></div>
                <div class="ecue-meta">
                  ${escapeHtml(ecue.code || "")}${ecue.teacher ? " • " + escapeHtml(ecue.teacher) : ""}
                </div>
                ${ecue.description ? `<div class="ecue-desc">${escapeHtml(ecue.description)}</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

// =====================
// Helpers
// =====================
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
