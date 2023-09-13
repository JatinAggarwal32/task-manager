
window.addEventListener('load', () => {
    const form = document.querySelector("#f1");
    const input = document.querySelector("#inf");
    const dateInput = document.querySelector("#date");
    const categorySelect = document.querySelector("#category");
    const list_el = document.querySelector("#tasks");
    const sortingControls = document.querySelector("#sorting-controls");
    const tasks = []; // Array to store task objects
    const filterCategory = document.querySelector("#filter-category");
    const filterButton = document.querySelector("#filter-button");
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasksToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToDOM = (taskObj) => {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        const task_description = document.createElement('p');
        task_description.textContent = `(Date: ${taskObj.taskDate}, Category: ${taskObj.category})`;

        task_content_el.appendChild(task_description);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = taskObj.task;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_complete_el = document.createElement('button');
        task_complete_el.classList.add('complete');
        task_complete_el.innerText = 'Complete';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_complete_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_content_el);
        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        // Check the 'completed' property to determine the background color
        if (taskObj.completed) {
            task_el.classList.add('completed');
        }

        task_complete_el.addEventListener('click', () => {
            taskObj.completed = !taskObj.completed;
            task_el.classList.toggle('completed', taskObj.completed);

            // Update the 'completed' property in the tasks array
            tasks.forEach((item, index) => {
                if (item === taskObj) {
                    tasks[index].completed = taskObj.completed;
                    return false; // Exit the loop early
                }
            });

            // Save the updated tasks array to local storage
            saveTasksToLocalStorage();
        });

        task_edit_el.addEventListener('click', (e) => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
                tasks.find((task) => {
                    if (task.task == taskObj.task) {
                        task.task = task_input_el.value;
                    }
                });
                saveTasksToLocalStorage();
            }
        });

        task_delete_el.addEventListener('click', (e) => {
            list_el.removeChild(task_el);

            const index = tasks.findIndex(item => item === taskObj);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
            }
        });
    };

    const displaySortedTasks = (sortedTasks) => {
        // Clear the current task list
        list_el.innerHTML = '';

        sortedTasks.forEach((taskObj) => {
            addTaskToDOM(taskObj);
        });
    };

    const searchTasks = () => {
        const searchQuery = searchInput.value.toLowerCase();
        const matchedTasks = tasks.filter(task =>
            task.task.toLowerCase().includes(searchQuery) ||
            task.category.toLowerCase().includes(searchQuery) ||
            task.taskDate.toLowerCase().includes(searchQuery)
        );
        // Display the matched tasks
        displaySortedTasks(matchedTasks);
    };

    searchButton.addEventListener('click', searchTasks);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchTasks();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value;
        const taskDate = dateInput.value;
        const category = categorySelect.value;
        const taskObj = { task, taskDate, category, completed: false };
        tasks.push(taskObj);
        saveTasksToLocalStorage();
        addTaskToDOM(taskObj);
        input.value = '';
        dateInput.value = '';
    });

    document.getElementById('sort-by-due-date').addEventListener('click', () => {
        const sortedByDueDate = [...tasks].sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate));
        displaySortedTasks(sortedByDueDate);
    });

    document.getElementById('sort-by-completion').addEventListener('click', () => {
        const sortedByCompletion = [...tasks].sort((a, b) => a.completed ? -1 : 1);
        displaySortedTasks(sortedByCompletion);
    });

    document.getElementById('sort-by-category').addEventListener('click', () => {
        const sortedByCategory = [...tasks].sort((a, b) => b.category.localeCompare(a.category));
        displaySortedTasks(sortedByCategory);
    });

    filterButton.addEventListener('click', () => {
        const selectedCategory = filterCategory.value;

        let filteredTasks;
        if (selectedCategory === "all") {
            filteredTasks = tasks; // Show all tasks
        } else {
            filteredTasks = tasks.filter(task => task.category === selectedCategory);
        }

        // Display the filtered tasks
        displaySortedTasks(filteredTasks);
    });

    storedTasks.forEach((taskObj) => {
        tasks.push(taskObj);
        addTaskToDOM(taskObj);
    });
});


function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let meridiem = 'AM';

    // Convert hours to 12-hour format and determine AM or PM
    if (hours > 12) {
        hours -= 12;
        meridiem = 'PM';
    }

    // Handle midnight (12:00 AM) and noon (12:00 PM)
    if (hours === 0) {
        hours = 12;
    }

    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    clockElement.textContent = timeString;
}

// Update the clock immediately and then every second
updateClock(); // Call the function to set the initial time
setInterval(updateClock, 1000); // Update every second




