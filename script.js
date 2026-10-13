
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("todo-tasks")) || [];
} catch {
    tasks = [];
}

let currentFilter = "all";
let editingId = null;

function saveTasks() {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

function renderTasks() {
    list.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.toggle("completed", task.completed);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.textContent = task.text;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            input.value = task.text;
            editingId = task.id;
            input.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, text, editButton, deleteButton);
        list.appendChild(li);
    });

    emptyMessage.hidden = filteredTasks.length > 0;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    if (editingId !== null) {
        const task = tasks.find(item => item.id === editingId);
        if (task) task.text = text;
        editingId = null;
    } else {
        tasks.push({
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            text,
            completed: false
        });
    }

    saveTasks();
    form.reset();
    renderTasks();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();
