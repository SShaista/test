// =====================
// Examens & Tâches - Page examens.html
// =====================

const EXAMS_KEY = "studentPortal.exams.v2";
const TASKS_KEY = "studentPortal.tasks.v2";

let examsData = loadJson(EXAMS_KEY, []);
let tasksData = loadJson(TASKS_KEY, []);

// DOM
const loadingScreen = document.getElementById("loading-screen");
const app = document.getElementById("app");
const currentDateEl = document.getElementById("current-date");

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  if (currentDateEl) {
    currentDateEl.textContent = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  setTimeout(() => {
    loadingScreen?.classList.add("hidden");
    app?.classList.remove("hidden");
  }, 300);

  setupExamForm();
  setupTaskInput();

  renderExams();
  renderTasks();
});

// =====================
// Examens
// =====================
function setupExamForm() {
  const addBtn = document.getElementById("addExamBtn");
  addBtn?.addEventListener("click", addExam);
}

function addExam() {
  const type = document.getElementById("examType")?.value || "Examen";
  const courseName = document.getElementById("examCourse")?.value?.trim();
  const date = document.getElementById("examDate")?.value;
  const time = document.getElementById("examTime")?.value || "09:00";
  const room = document.getElementById("examRoom")?.value?.trim() || "";

  if (!courseName) {
    alert("Entre le nom du cours.");
    return;
  }
  if (!date) {
    alert("Choisis une date.");
    return;
  }

  const newExam = {
    id: "exam_" + Date.now(),
    type,
    courseName,
    date,
    time,
    room,
  };

  examsData.unshift(newExam);
  saveJson(EXAMS_KEY, examsData);

  // reset light
  const c = document.getElementById("examCourse");
  const r = document.getElementById("examRoom");
  if (c) c.value = "";
  if (r) r.value = "";

  renderExams();
}

function deleteExam(examId) {
  examsData = examsData.filter((e) => e.id !== examId);
  saveJson(EXAMS_KEY, examsData);
  renderExams();
}
window.deleteExam = deleteExam;

function renderExams() {
  const container = document.getElementById("exams-list");
  if (!container) return;

  const sorted = [...examsData].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time || "00:00"}`);
    const db = new Date(`${b.date}T${b.time || "00:00"}`);
    return da - db;
  });

  if (!sorted.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>Aucun examen.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = sorted
    .map((exam) => {
      const countdown = formatCountdown(exam.date);

      return `
        <div class="schedule-card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
            <span class="time-badge" style="background:${getTypeColor(exam.type)};font-size:11px;">
              ${escapeHtml(exam.type)}
            </span>
            <span style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
              ⏳ ${escapeHtml(countdown)}
            </span>
          </div>

          <h3 style="font-size:15px;font-weight:600;margin-bottom:10px;">
            ${escapeHtml(exam.courseName)}
          </h3>

          <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--text-muted);">
            <span style="display:flex;align-items:center;gap:6px;">📅 ${escapeHtml(formatDate(exam.date))}</span>
            <span style="display:flex;align-items:center;gap:6px;">🕒 ${escapeHtml(exam.time)}</span>
            ${exam.room ? `<span style="display:flex;align-items:center;gap:6px;">📍 ${escapeHtml(exam.room)}</span>` : ""}
          </div>

          <div style="display:flex;justify-content:flex-end;margin-top:10px;">
            <button class="icon-btn" title="Supprimer"
              style="width:auto;height:auto;padding:8px 10px;border-radius:10px;border:1px solid var(--border);"
              onclick="deleteExam('${escapeHtmlAttr(exam.id)}')">
              🗑️
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function getTypeColor(type) {
  switch (type) {
    case "Examen": return "var(--danger)";
    case "Contrôle": return "var(--warning)";
    case "Devoir": return "var(--primary)";
    default: return "var(--text-muted)";
  }
}

// =====================
// Tâches (titre + priorité uniquement)
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
  const prio = document.getElementById("task-priority")?.value || "medium";

  const title = input?.value?.trim();
  if (!title) return;

  const newTask = {
    id: "task_" + Date.now(),
    title,
    dueDate: new Date().toISOString().split("T")[0],
    completed: false,
    priority: prio,
  };

  tasksData.unshift(newTask);
  saveJson(TASKS_KEY, tasksData);

  if (input) input.value = "";
  renderTasks();
}

function toggleTask(taskId) {
  const task = tasksData.find((t) => t.id === taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveJson(TASKS_KEY, tasksData);
  renderTasks();
}

function deleteTask(taskId) {
  tasksData = tasksData.filter((t) => t.id !== taskId);
  saveJson(TASKS_KEY, tasksData);
  renderTasks();
}

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

function renderTasks() {
  const container = document.getElementById("tasks-list");
  if (!container) return;

  if (!tasksData.length) {
    container.innerHTML = `
      <div class="empty-state" style="padding:24px;">
        <div class="empty-icon">✓</div>
        <p>Aucune tâche.</p>
      </div>
    `;
    updateTaskSummary();
    return;
  }

  container.innerHTML = tasksData
    .map((task) => {
      return `
        <div class="task-item ${task.completed ? "completed" : ""}"
          style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:white;border-radius:var(--radius);border:1px solid var(--border);margin-bottom:8px;">
          
          <div onclick="toggleTask('${escapeHtmlAttr(task.id)}')"
            style="width:22px;height:22px;border:2px solid ${task.completed ? "var(--success)" : "var(--border)"};border-radius:50%;
              display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;
              background:${task.completed ? "var(--success)" : "transparent"};color:white;">
            ${task.completed ? "✓" : ""}
          </div>

          <div style="flex:1;min-width:0;">
            <p style="font-size:14px;font-weight:500;${task.completed ? "text-decoration:line-through;color:var(--text-muted);" : ""}">
              ${escapeHtml(task.title)}
            </p>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted);margin-top:2px;">
              <span>${escapeHtml(formatCountdown(task.dueDate))}</span>
            </div>
          </div>

          <span style="font-size:10px;font-weight:600;padding:4px 10px;border-radius:999px;${priorityStyle(task.priority)}">
            ${priorityLabel(task.priority)}
          </span>

          <button onclick="deleteTask('${escapeHtmlAttr(task.id)}')"
            style="padding:6px;color:var(--text-muted);border-radius:6px;">
            🗑️
          </button>
        </div>
      `;
    })
    .join("");

  updateTaskSummary();
}

function priorityLabel(p) {
  if (p === "high") return "Haute";
  if (p === "low") return "Basse";
  return "Moyenne";
}

function priorityStyle(p) {
  if (p === "high") return "background:rgba(220,53,69,.12);color:var(--danger);";
  if (p === "low") return "background:rgba(40,167,69,.12);color:var(--success);";
  return "background:rgba(255,193,7,.15);color:#b8860b;";
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
// Utils
// =====================
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

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
