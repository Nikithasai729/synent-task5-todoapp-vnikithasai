const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeTasks} tasks left`;

  emptyState.style.display =
    tasks.length === 0 ? "block" : "none";
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text,
    completed: false
  });

  taskInput.value = "";

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");

    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();