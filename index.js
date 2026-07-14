 document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('task-input');
            const addBtn = document.getElementById('add-btn');
            const tasksList = document.getElementById('tasks-list');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const totalCount = document.getElementById('total-count');
            const completedCount = document.getElementById('completed-count');
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';
            
            // Initialize the app
            renderTasks();
            updateStats();
            
            // Add task event
            addBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            // Filter events
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderTasks();
                });
            });
            
            function addTask() {
                const taskText = taskInput.value.trim();
                if (taskText === '') return;
                
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    timestamp: new Date().toISOString()
                };
                
                tasks.push(newTask);
                saveTasks();
                renderTasks();
                updateStats();
                
                taskInput.value = '';
                taskInput.focus();
            }
            
            function renderTasks() {
                tasksList.innerHTML = '';
                
                const filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                   

                    return true;
                });
                
                if (filteredTasks.length === 0) {
                    tasksList.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">No tasks found</p>';
                    return;
                }
                
                filteredTasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
                    taskElement.innerHTML = `
                        <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${task.text}</span>
                        <button class="delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;
                    tasksList.appendChild(taskElement);
                });
                
                // Add event listeners to checkboxes and delete buttons
                document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', toggleTaskStatus);
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', deleteTask);
                });
            }
            
            function toggleTaskStatus(e) {
                const taskId = Number(e.target.dataset.id);
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = e.target.checked;
                    saveTasks();
                    renderTasks();
                    updateStats();
                }
            }
            
            function deleteTask(e) {
                const taskId = Number(e.currentTarget.dataset.id);
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
                updateStats();
            }
            
            function updateStats() {
                totalCount.textContent = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                completedCount.textContent = completedTasks;
            }
            
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });