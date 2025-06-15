let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const filter = document.getElementById("filter").value;
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "priority") return task.priority;
    return true;
  });

  filteredTasks.sort((a, b) => b.priority - a.priority);

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.setAttribute("draggable", "true");
    li.ondragstart = (e) => e.dataTransfer.setData("text/plain", index);
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = (e) => {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData("text/plain");
      const temp = tasks[draggedIndex];
      tasks.splice(draggedIndex, 1);
      tasks.splice(index, 0, temp);
      saveTasks();
      renderTasks();
    };

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.className = "info-box";
    categoryInput.value = task.category || "";
    categoryInput.disabled = true;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "info-box";
    dateInput.value = task.dueDate || "";
    dateInput.disabled = true;

    infoContainer.appendChild(categoryInput);
    infoContainer.appendChild(dateInput);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("i");
    editBtn.className = "fa-solid fa-pen-to-square";
    editBtn.onclick = () => {
      const textInput = document.createElement("input");
      textInput.value = task.text;
      textInput.className = "editing-input";

      span.replaceWith(textInput);
      categoryInput.disabled = false;
      dateInput.disabled = false;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "save-btn";
      saveBtn.onclick = () => {
        task.text = textInput.value.trim();
        task.category = categoryInput.value;
        task.dueDate = dateInput.value;
        saveTasks();
        renderTasks();
      };

      actions.insertBefore(saveBtn, priorityBtn);
      textInput.focus();
    };

    const priorityBtn = document.createElement("i");
    priorityBtn.className = task.priority ? "fa-solid fa-star priority" : "fa-regular fa-star";
    priorityBtn.onclick = () => {
      task.priority = !task.priority;
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fa-solid fa-trash";
    deleteBtn.onclick = () => {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      renderTasks();
    };

    actions.appendChild(editBtn);
    actions.appendChild(priorityBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(infoContainer);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate").value;
  const category = document.getElementById("categoryInput").value;
  const text = input.value.trim();
  if (text === "") {
    alert("Task cannot be empty");
    return;
  }
  tasks.push({ text, completed: false, priority: false, dueDate, category });
  saveTasks();
  input.value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("categoryInput").value = "";
  renderTasks();
}

renderTasks();
