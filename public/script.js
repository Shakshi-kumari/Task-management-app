document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('tasks');
    const editModal = document.getElementById('edit-modal');
    const editTaskForm = document.getElementById('edit-task-form');

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);

    var dateElems = document.querySelectorAll('.datepicker');
    var dateInstances = M.Datepicker.init(dateElems, {
        format: 'yyyy-mm-dd'
    });

    // Fetch and display tasks
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'collection-item';
                    taskItem.innerHTML = `
                    <div class="outerTaskCard">
                        <div class="internalTaskCard">
                            <h5 class="title">${task.title}</h5>
                            <p class="taskDueDate"><strong class="due">Due:</strong> ${task.dueDate}</p>
                            <p class="taskDescription">${task.description}</p>
                        </div>
                        <div class="ActionButton">
                            <button class="btn waves-effect waves-light" onclick="editTask(${task.id})">Edit</button>
                            <button class="btn red waves-effect waves-light" onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    </div>
                    `;
                    taskList.appendChild(taskItem);
                });
            });
    }

    // Add new task
    taskForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(taskForm);
        const task = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('dueDate')
        };

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(newTask => {
            taskForm.reset();
            fetchTasks();
        });
    });

    // Edit task
    window.editTask = function (id) {
        fetch(`/tasks/${id}`)
            .then(response => response.json())
            .then(task => {
                document.getElementById('edit-id').value = task.id;
                document.getElementById('edit-title').value = task.title;
                document.getElementById('edit-description').value = task.description;
                document.getElementById('edit-dueDate').value = task.dueDate;
                M.updateTextFields();
                instances[0].open();
            });
    };

    // Update task
    editTaskForm.addEventListener('submit', event => {
        event.preventDefault();

        const taskId = document.getElementById('edit-id').value;
        const task = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            dueDate: document.getElementById('edit-dueDate').value
        };

        fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            instances[0].close();
            fetchTasks();
        });
    });

    // Delete task
    window.deleteTask = function (id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks();
        });
    };

    fetchTasks();
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
