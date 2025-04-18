// Timer-Funktionalität
class FocusTimer {
    constructor() {
        this.state = {
            minutes: 25,
            seconds: 0,
            totalSeconds: 25 * 60,
            originalTotalSeconds: 25 * 60,
            isRunning: false,
            intervalId: null,
            currentTaskId: null
        };


        // DOM-Elemente
        
        // DOM-Elemente abrufen
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.minutesInput = document.getElementById('minutesInput');
        this.secondsInput = document.getElementById('secondsInput');
        this.progressBar = document.getElementById('progressBar');
        this.currentTaskElement = document.getElementById('currentTask');
        this.notification = document.getElementById('notification');
        
        // Event-Listener hinzufügen
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.minutesInput.addEventListener('change', () => this.updateTimerFromInputs());
        this.secondsInput.addEventListener('change', () => this.updateTimerFromInputs());
        
        // Initialisierung
        this.updateDisplay();
    }

    updateTimerFromInputs() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        if (minutes < 0 || minutes > 60) {
            this.minutesInput.value = '25';
            return;
        }
        
        if (seconds < 0 || seconds > 59) {
            this.secondsInput.value = '0';
            return;
        }
        
        this.state.minutes = minutes;
        this.state.seconds = seconds;
        this.state.totalSeconds = minutes * 60 + seconds;
        this.state.originalTotalSeconds = this.state.totalSeconds;
        
        this.updateDisplay();
        this.updateProgressBar();
    }

    updateDisplay() {
        const minutesDisplay = String(this.state.minutes).padStart(2, '0');
        const secondsDisplay = String(this.state.seconds).padStart(2, '0');
        this.timerDisplay.textContent = `${minutesDisplay}:${secondsDisplay}`;
    }

    updateProgressBar() {
        if (this.state.originalTotalSeconds === 0) return;
        
        const percentage = 100 - (this.state.totalSeconds / this.state.originalTotalSeconds * 100);
        this.progressBar.style.width = `${percentage}%`;
    }

    startTimer() {
        if (this.state.isRunning) return;
        
        // Überprüfen, ob Timer bei Null ist
        if (this.state.totalSeconds === 0) {
            this.resetTimer();
        }
        
        this.state.isRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'flex';
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        
        this.state.intervalId = setInterval(() => {
            this.state.totalSeconds--;
            
            if (this.state.totalSeconds < 0) {
                this.timerComplete();
                return;
            }
            
            this.state.minutes = Math.floor(this.state.totalSeconds / 60);
            this.state.seconds = this.state.totalSeconds % 60;
            
            this.updateDisplay();
            this.updateProgressBar();
        }, 1000);
    }

    pauseTimer() {
        if (!this.state.isRunning) return;
        
        this.state.isRunning = false;
        this.startBtn.style.display = 'flex';
        this.pauseBtn.style.display = 'none';
        
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }

    resetTimer() {
        this.pauseTimer();
        
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;
        
        this.state.minutes = parseInt(this.minutesInput.value) || 25;
        this.state.seconds = parseInt(this.secondsInput.value) || 0;
        this.state.totalSeconds = this.state.minutes * 60 + this.state.seconds;
        this.state.originalTotalSeconds = this.state.totalSeconds;
        
        this.updateDisplay();
        this.updateProgressBar();
    }

    timerComplete() {
        this.pauseTimer();
        this.resetTimer();
        
        // Benachrichtigung anzeigen
        this.notification.textContent = 'Timer abgelaufen!';
        this.notification.classList.add('show');
        
        // Sound abspielen
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(e => console.log('Audio konnte nicht abgespielt werden:', e));
        
        // Benachrichtigung nach einigen Sekunden ausblenden
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    setCurrentTask(taskId, taskText) {
        this.state.currentTaskId = taskId;
        
        if (taskId !== null && taskText !== null) {
            this.currentTaskElement.textContent = taskText;
        } else {
            this.currentTaskElement.textContent = 'Keine Aufgabe ausgewählt';
        }
    }
}

// Todo-Liste Funktionalität
class TodoList {
    constructor(focusTimer) {
        this.focusTimer = focusTimer;
        this.todos = [];
        
        // DOM-Elemente abrufen
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        
        // Event-Listener hinzufügen
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });
        
        // Gespeicherte Todos laden
        this.loadTodos();
        this.renderTodos();
    }

    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            try {
                this.todos = JSON.parse(savedTodos);
            } catch (e) {
                this.todos = [];
            }
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo() {
        const todoText = this.todoInput.value.trim();
        if (!todoText) return;
        
        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        
        this.todos.push(newTodo);
        this.todoInput.value = '';
        
        this.renderTodos();
        this.saveTodos();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.renderTodos();
        this.saveTodos();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        this.renderTodos();
        this.saveTodos();
    }

    setFocusTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.focusTimer.setCurrentTask(todo.id, todo.text);
        }
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        
        if (this.todos.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'Keine Aufgaben vorhanden';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--text-light)';
            emptyMessage.style.padding = '1rem';
            this.todoList.appendChild(emptyMessage);
            return;
        }
        
        this.todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const todoText = document.createElement('div');
            todoText.className = 'todo-text';
            todoText.textContent = todo.text;
            
            const todoActions = document.createElement('div');
            todoActions.className = 'todo-actions';
            
            const focusBtn = document.createElement('button');
            focusBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V3.5A.5.5 0 0 1 8 3z"/><path d="M14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"/></svg>';
            focusBtn.title = 'Fokussieren';
            focusBtn.addEventListener('click', () => this.setFocusTodo(todo.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'danger';
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
            deleteBtn.title = 'Löschen';
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            todoActions.appendChild(focusBtn);
            todoActions.appendChild(deleteBtn);
            
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoText);
            todoItem.appendChild(todoActions);
            
            this.todoList.appendChild(todoItem);
        });
    }
}

// Dunkles Theme Umschalter
class ThemeToggler {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        
        // Event-Listener hinzufügen
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Gespeichertes Theme laden
        this.loadTheme();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeToggle.textContent = '☀️';
        }
    }

    toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            this.themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            this.themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    }
}

// App initialisieren
document.addEventListener('DOMContentLoaded', () => {
    const focusTimer = new FocusTimer();
    const todoList = new TodoList(focusTimer);
    const themeToggler = new ThemeToggler();

    // Load current task from local storage
    const savedTask = localStorage.getItem('currentTask');
    if (savedTask) {
        const { taskId, taskText } = JSON.parse(savedTask);
        focusTimer.setCurrentTask(taskId, taskText);
    }

    // Save current task to local storage when it changes
    const originalSetCurrentTask = focusTimer.setCurrentTask.bind(focusTimer);
    focusTimer.setCurrentTask = (taskId, taskText) => {
        originalSetCurrentTask(taskId, taskText);
        localStorage.setItem('currentTask', JSON.stringify({ taskId, taskText }));
    };
});

