const ueData = window.ueData || [];

const EXAMS_KEY = "portal.exams";
const TASKS_KEY = "portal.tasks";

let examsData = JSON.parse(localStorage.getItem(EXAMS_KEY) || "[]");
let tasksData = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");

document.addEventListener("DOMContentLoaded", () => {

  const now = new Date();
  document.getElementById("current-date").textContent =
    now.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});

  setTimeout(()=>{
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  },300);

  populateCourses();
  renderExams();
  renderTasks();

  document.getElementById("addExamBtn").addEventListener("click", addExam);
  document.getElementById("add-task-btn").addEventListener("click", addTask);
});

/* ===================== COURSES ===================== */

function populateCourses(){
  const names = new Set();

  for(const ue of ueData){
    for(const ecue of ue.ecues || []){
      if(ecue.name) names.add(ecue.name);
    }
  }

  const sorted = Array.from(names).sort((a,b)=>a.localeCompare(b,"fr"));

  const examSelect = document.getElementById("examCourse");
  const taskSelect = document.getElementById("task-course");

  examSelect.innerHTML = `<option value="">Choisir un cours…</option>` +
    sorted.map(n=>`<option>${n}</option>`).join("");

  taskSelect.innerHTML =
    `<option value="Général">Général</option>` +
    sorted.map(n=>`<option>${n}</option>`).join("");
}

/* ===================== EXAMS ===================== */

function addExam(){
  const course = document.getElementById("examCourse").value;
  const type = document.getElementById("examType").value;
  const date = document.getElementById("examDate").value;
  const time = document.getElementById("examTime").value;
  const room = document.getElementById("examRoom").value;

  if(!course || !date) return;

  examsData.unshift({
    id: Date.now(),
    course,
    type,
    date,
    time,
    room
  });

  localStorage.setItem(EXAMS_KEY, JSON.stringify(examsData));
  renderExams();
}

function deleteExam(id){
  examsData = examsData.filter(e=>e.id!==id);
  localStorage.setItem(EXAMS_KEY, JSON.stringify(examsData));
  renderExams();
}

function renderExams(){
  const container = document.getElementById("exams-list");

  if(!examsData.length){
    container.innerHTML = `<div class="empty-state">Aucun examen.</div>`;
    return;
  }

  container.innerHTML = examsData.map(e=>`
    <div class="schedule-card">
      <div style="display:flex;justify-content:space-between;">
        <span class="badge ${badgeClass(e.type)}">${e.type}</span>
        <button onclick="deleteExam(${e.id})">🗑️</button>
      </div>
      <h3>${e.course}</h3>
      <div class="meta-row">
        <span>📅 ${e.date}</span>
        <span>🕒 ${e.time}</span>
        ${e.room ? `<span>📍 ${e.room}</span>` : ""}
      </div>
    </div>
  `).join("");
}

function badgeClass(type){
  if(type==="Examen") return "badge--exam";
  if(type==="Contrôle") return "badge--controle";
  return "badge--devoir";
}

window.deleteExam = deleteExam;

/* ===================== TASKS ===================== */

function addTask(){
  const title = document.getElementById("new-task-input").value.trim();
  const course = document.getElementById("task-course").value;
  const priority = document.getElementById("task-priority").value;

  if(!title) return;

  tasksData.unshift({
    id: Date.now(),
    title,
    course,
    priority,
    completed:false
  });

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasksData));
  document.getElementById("new-task-input").value="";
  renderTasks();
}

function toggleTask(id){
  const t = tasksData.find(x=>x.id===id);
  if(t) t.completed=!t.completed;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasksData));
  renderTasks();
}

function deleteTask(id){
  tasksData = tasksData.filter(t=>t.id!==id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasksData));
  renderTasks();
}

function renderTasks(){
  const container = document.getElementById("tasks-list");

  if(!tasksData.length){
    container.innerHTML = `<div class="empty-state">Aucune tâche.</div>`;
    return;
  }

  container.innerHTML = tasksData.map(t=>`
    <div class="task-item ${t.completed?"completed":""}" 
      style="display:flex;align-items:center;gap:12px;padding:12px;background:white;border-radius:var(--radius);margin-bottom:8px;">
      
      <div onclick="toggleTask(${t.id})"
        style="width:22px;height:22px;border-radius:50%;border:2px solid var(--border);
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        background:${t.completed?"var(--success)":"transparent"};color:white;">
        ${t.completed?"✓":""}
      </div>

      <div style="flex:1;">
        <p style="${t.completed?"text-decoration:line-through;color:var(--text-muted);":""}">
          ${t.title}
        </p>
        <small>${t.course}</small>
      </div>

      <span class="priority-pill ${priorityClass(t.priority)}">
        ${priorityLabel(t.priority)}
      </span>

      <button onclick="deleteTask(${t.id})">🗑️</button>
    </div>
  `).join("");

  updateSummary();
}

function priorityClass(p){
  if(p==="high") return "priority-pill--high";
  if(p==="low") return "priority-pill--low";
  return "priority-pill--medium";
}

function priorityLabel(p){
  if(p==="high") return "Haute";
  if(p==="low") return "Basse";
  return "Moyenne";
}

function updateSummary(){
  const done = tasksData.filter(t=>t.completed).length;
  document.getElementById("task-count").textContent =
    `${done} / ${tasksData.length} complétées`;
}

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
