// =====================
// Examens & Tâches - Page examens.html
// =====================

// Données des examens
const examsData = [
  { id: "exam1", courseName: "Analyse Numérique", date: "2026-01-25", time: "09:00", room: "Amphi A", type: "Examen" },
  { id: "exam2", courseName: "Mécanique des Fluides", date: "2026-01-28", time: "14:00", room: "Amphi B", type: "Contrôle" },
  { id: "exam3", courseName: "Programmation Orientée Objet", date: "2026-02-05", time: "10:00", room: "Salle Info 1", type: "Examen" },
  { id: "exam4", courseName: "Thermodynamique Appliquée", date: "2026-02-10", time: "08:30", room: "Amphi C", type: "Devoir" },
];

// Données des tâches (modifiable)
let tasksData = [
  { id: "task1", title: "Devoir de Mathématiques", courseName: "Analyse Numérique", dueDate: "2026-01-20", completed: false, priority: "high" },
  { id: "task2", title: "Projet de Programmation", courseName: "Programmation Orientée Objet", dueDate: "2026-01-22", completed: false, priority: "high" },
  { id: "task3", title: "Lecture de cours", courseName: "Mécanique des Fluides", dueDate: "2026-01-19", completed: true, priority: "medium" },
  { id: "task4", title: "Préparation laboratoire", courseName: "Circuits Électroniques", dueDate: "2026-01-24", completed: false, priority: "medium" },
  { id: "task5", title: "Rapport de TP", courseName: "Thermodynamique Appliquée", dueDate: "2026-01-26", completed: false, priority: "low" },
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

  // Render
  renderExams();
  renderTasks();
  setupTaskInput();
});

// =====================
// Examens
// =====================
function renderExams() {
  const container = document.getElementById("exams-list");
  if (!container) return;

  if (!examsData.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>Aucun examen prévu.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = examsData.map((exam) => {
    const typeClass = exam.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const countdown = formatCountdown(exam.date);
    
    return `
      <div class="schedule-card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
          <span class="time-badge ${typeClass}" style="background:${getTypeColor(exam.type)};font-size:11px;">
            ${exam.type}
          </span>
          <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            ${countdown}
          </span>
        </div>
        <h3 style="font-size:15px;font-weight:600;margin-bottom:10px;">${escapeHtml(exam.courseName)}</h3>
        <div style="display:flex;gap:16px;font-size:13px;color:var(--text-muted);">
          <span style="display:flex;align-items:center;gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${formatDate(exam.date)}
          </span>
          <span style="display:flex;align-items:center;gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${exam.time}
          </span>
          <span style="display:flex;align-items:center;gap:6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${escapeHtml(exam.room)}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function getTypeColor(type) {
  switch (type) {
    case "Examen": return "var(--danger)";
    case "Contrôle": return "var(--warning)";
    case "Devoir": return "var(--primary)";
    default: return "var(--text-muted)";
  }
}

function formatCountdown(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  if (diffDays > 0 && diffDays <= 7) return `Dans ${diffDays} jours`;
  return formatDate(dateStr);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// =====================
// Tâches
// =====================
function setupTaskInput() {
  const input = document.getElementById("new-task-input");
  const btn = document.getElementById("add-task-btn");
  
  if (!btn || !input) return;
  
  btn.addEventListener("click", addTask);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
}

function addTask() {
  const input = document.getElementById("new-task-input");
  const title = input?.value?.trim();
  
  if (title) {
    const newTask = {
      id: "task" + Date.now(),
      title: title,
      courseName: "Général",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      priority: "medium",
    };
    tasksData.unshift(newTask);
    if (input) input.value = "";
    renderTasks();
  }
}

function toggleTask(taskId) {
  const task = tasksData.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

function deleteTask(taskId) {
  tasksData = tasksData.filter((t) => t.id !== taskId);
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById("tasks-list");
  if (!container) return;

  if (!tasksData.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding:24px;">
        <div class="empty-icon">✓</div>
        <p>Aucune tâche pour le moment.</p>
      </div>
    `;
    updateTaskSummary();
    return;
  }

  container.innerHTML = tasksData
    .map((task) => {
      return `
        <div class="task-item ${task.completed ? "completed" : ""}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:white;border-radius:var(--radius);border:1px solid var(--border);margin-bottom:8px;">
          <div class="task-checkbox ${task.completed ? "checked" : ""}" onclick="toggleTask('${task.id}')" style="width:22px;height:22px;border:2px solid ${task.completed ? "var(--success)" : "var(--border)"};border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;background:${task.completed ? "var(--success)" : "transparent"};">
            ${task.completed ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ""}
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-size:14px;font-weight:500;${task.completed ? "text-decoration:line-through;color:var(--text-muted);" : ""}">${escapeHtml(task.title)}</p>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted);margin-top:2px;">
              <span>${escapeHtml(task.courseName)}</span>
              <span>•</span>
              <span>${formatCountdown(task.dueDate)}</span>
            </div>
          </div>
          <span class="task-priority ${task.priority}" style="font-size:10px;font-weight:500;padding:3px 8px;border-radius:4px;background:${getPriorityBg(task.priority)};color:${getPriorityColor(task.priority)};">
            ${task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
          </span>
          <button onclick="deleteTask('${task.id}')" style="padding:6px;color:var(--text-muted);border-radius:6px;" onmouseover="this.style.color='var(--danger)'" onmouseout="this.style.color='var(--text-muted)'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
    })
    .join("");

  updateTaskSummary();
}

function getPriorityBg(priority) {
  switch (priority) {
    case "high": return "rgba(220, 53, 69, 0.1)";
    case "medium": return "rgba(255, 193, 7, 0.1)";
    case "low": return "rgba(40, 167, 69, 0.1)";
    default: return "var(--border)";
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high": return "var(--danger)";
    case "medium": return "var(--warning)";
    case "low": return "var(--success)";
    default: return "var(--text-muted)";
  }
}

function updateTaskSummary() {
  const completed = tasksData.filter((t) => t.completed).length;
  const total = tasksData.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const countEl = document.getElementById("task-count");
  const percentEl = document.getElementById("task-percent");
  if (countEl) countEl.textContent = `${completed} / ${total} complétées`;
  if (percentEl) percentEl.textContent = `${percent}% terminé`;
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
