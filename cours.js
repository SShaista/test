// =====================
// Cours (UE/ECUE) - Page cours.html
// =====================

let selectedSemester = "all";

const ueData = [
  {
    id: "ue-s1-maths",
    semester: 1,
    title: "UE Mathématiques & Modélisation",
    code: "UE1",
    ecues: [
      { id: "ecue1", name: "Analyse Numérique", code: "MAT-101", teacher: "Dr. Martin", credits: 3, description: "Méthodes numériques pour la résolution d'équations différentielles et l'optimisation.", color: "#007bff" },
      { id: "ecue8", name: "Probabilités et Statistiques", code: "MAT-103", teacher: "Dr. Michel", credits: 3, description: "Théorie des probabilités et méthodes statistiques pour l'ingénieur.", color: "#e83e8c" },
    ],
  },
  {
    id: "ue-s1-meca",
    semester: 1,
    title: "UE Mécanique",
    code: "UE2",
    ecues: [
      { id: "ecue4", name: "Résistance des Matériaux", code: "MEC-102", teacher: "Dr. Robert", credits: 4, description: "Analyse des contraintes et déformations dans les structures mécaniques.", color: "#ffc107" },
    ],
  },
  {
    id: "ue-s2-phys",
    semester: 2,
    title: "UE Physique & Thermodynamique",
    code: "UE3",
    ecues: [
      { id: "ecue2", name: "Mécanique des Fluides", code: "PHY-201", teacher: "Dr. Bernard", credits: 4, description: "Étude des fluides en mouvement, équations de Navier-Stokes et applications.", color: "#17a2b8" },
      { id: "ecue5", name: "Thermodynamique Appliquée", code: "PHY-202", teacher: "Dr. Richard", credits: 3, description: "Principes thermodynamiques et applications en ingénierie.", color: "#dc3545" },
    ],
  },
  {
    id: "ue-s2-elec",
    semester: 2,
    title: "UE Électronique",
    code: "UE4",
    ecues: [
      { id: "ecue7", name: "Circuits Électroniques", code: "ELE-201", teacher: "Dr. Laurent", credits: 4, description: "Conception et analyse de circuits électroniques analogiques et numériques.", color: "#fd7e14" },
    ],
  },
  {
    id: "ue-s3-info",
    semester: 3,
    title: "UE Informatique & Dev",
    code: "UE5",
    ecues: [
      { id: "ecue3", name: "Programmation Orientée Objet", code: "INFO-301", teacher: "Dr. Petit", credits: 5, description: "Concepts avancés de POO, design patterns, développement d'applications.", color: "#28a745" },
      { id: "ecue6", name: "Développement Web Full Stack", code: "INFO-302", teacher: "Dr. Simon", credits: 6, description: "Apps web modernes (front/back) et bases de données.", color: "#6f42c1" },
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
// Render Cours
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
  const totalECTS = filteredUEs.reduce(
    (acc, ue) => acc + ue.ecues.reduce((a, e) => a + (e.credits || 0), 0),
    0
  );

  const cEl = document.getElementById("coursesCount");
  const uEl = document.getElementById("uesCount");
  const eEl = document.getElementById("ectsTotal");
  if (cEl) cEl.textContent = String(totalECUE);
  if (uEl) uEl.textContent = String(totalUE);
  if (eEl) eEl.textContent = String(totalECTS);

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
      const ects = ue.ecues.reduce((a, e) => a + (e.credits || 0), 0);
      return `
        <div class="ue-card">
          <div class="ue-header">
            <div>
              <div class="ue-code">${escapeHtml(ue.code || "")}</div>
              <h3 class="ue-title">${escapeHtml(ue.title)}</h3>
            </div>
            <div class="ue-ects">${ects} ECTS</div>
          </div>

          <div class="ue-content">
            ${ue.ecues
              .map(
                (ecue) => `
              <div class="ecue-item">
                <div class="ecue-name"><strong>${escapeHtml(ecue.name)}</strong> — ${ecue.credits || 0} ECTS</div>
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
