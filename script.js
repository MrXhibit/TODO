class TodoApp {
    constructor() {
        this.todos = this.loadFromStorage();
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.editingId = null;
        this.confirmCallback = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
        this.updateStats();
        this.checkPendingNotifications();
        
        setInterval(() => this.checkPendingNotifications(), 30000);
    }

    initializeElements() {
        this.todoForm = document.getElementById('todo-form');
        this.todoTitle = document.getElementById('todo-title');
        this.todoDescription = document.getElementById('todo-description');
        this.todoPriority = document.getElementById('todo-priority');
        this.todoDueDate = document.getElementById('todo-due-date');
        this.todoStartTime = document.getElementById('todo-start-time');
        this.todoEndTime = document.getElementById('todo-end-time');
        
        // Set minimum date to today in local time zone
        const today = this.getLocalDateString();
        this.todoDueDate.min = today;
        
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        
        this.searchInput = document.getElementById('search-input');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.totalCount = document.getElementById('total-count');
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');
        
        this.markAllDoneBtn = document.getElementById('mark-all-done');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.clearAllBtn = document.getElementById('clear-all');
        
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.editId = document.getElementById('edit-id');
        this.editTitle = document.getElementById('edit-title');
        this.editDescription = document.getElementById('edit-description');
        this.editPriority = document.getElementById('edit-priority');
        this.editDueDate = document.getElementById('edit-due-date');
        this.editStartTime = document.getElementById('edit-start-time');
        this.editEndTime = document.getElementById('edit-end-time');
        this.cancelEditBtn = document.getElementById('cancel-edit');
        this.closeBtn = document.querySelector('.close');
        
        // Set minimum date to today in local time zone for edit modal
        this.editDueDate.min = today;
        
        this.confirmModal = document.getElementById('confirm-modal');
        this.confirmMessage = document.getElementById('confirm-message');
        this.confirmActionBtn = document.getElementById('confirm-action');
        this.cancelActionBtn = document.getElementById('cancel-action');
        
        this.notificationContainer = document.getElementById('notification-container');
    }

    // Helper function to get local date string in YYYY-MM-DD format
    getLocalDateString(date = new Date()) {
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().split('T')[0];
    }

    attachEventListeners() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        this.markAllDoneBtn.addEventListener('click', () => this.markAllDone());
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        
        this.editForm.addEventListener('submit', (e) => this.handleEditTodo(e));
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.closeBtn.addEventListener('click', () => this.closeEditModal());
        
        this.confirmActionBtn.addEventListener('click', () => this.executeConfirmAction());
        this.cancelActionBtn.addEventListener('click', () => this.closeConfirmModal());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
            if (e.target === this.confirmModal) {
                this.closeConfirmModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
                this.closeConfirmModal();
            }
        });
    }

    createTodo(title, description, priority, dueDate, startTime, endTime) {
        const todo = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            priority: priority,
            dueDate: dueDate || null,
            startTime: startTime || null,
            endTime: endTime || null,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo);
        this.saveToStorage();
        this.showNotification('Task created successfully!', 'success');
        return todo;
    }

    updateTodo(id, updates) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            this.todos[todoIndex] = {
                ...this.todos[todoIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            this.showNotification('Task updated successfully!', 'success');
            return this.todos[todoIndex];
        }
        return null;
    }

    deleteTodo(id) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            const deletedTodo = this.todos.splice(todoIndex, 1)[0];
            this.saveToStorage();
            this.showNotification('Task deleted successfully!', 'success');
            return deletedTodo;
        }
        return null;
    }

    toggleTodoComplete(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            
            const message = todo.completed ? 
                'Task marked as completed!' : 
                'Task marked as pending!';
            this.showNotification(message, 'success');
            return todo;
        }
        return null;
    }

    handleAddTodo(e) {
        e.preventDefault();
        
        const title = this.todoTitle.value;
        const description = this.todoDescription.value;
        const priority = this.todoPriority.value;
        const dueDate = this.todoDueDate.value;
        const startTime = this.todoStartTime.value;
        const endTime = this.todoEndTime.value;
        
        if (!title.trim()) {
            this.showNotification('Please enter a task title!', 'error');
            return;
        }
        
        if (startTime && endTime && startTime >= endTime) {
            this.showNotification('End time must be after start time!', 'error');
            return;
        }
        
        if (dueDate) {
            const today = this.getLocalDateString();
            if (dueDate < today) {
                this.showNotification('Due date cannot be in the past!', 'error');
                return;
            }
        }
        
        this.createTodo(title, description, priority, dueDate, startTime, endTime);
        this.todoForm.reset();
        this.render();
        this.updateStats();
    }

    handleSearch(e) {
        this.currentSearch = e.target.value.toLowerCase();
        this.render();
    }

    handleFilter(e) {
        // Remove active class from all buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update current filter
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    handleEditTodo(e) {
        e.preventDefault();
        
        const id = this.editId.value;
        const title = this.editTitle.value;
        const description = this.editDescription.value;
        const priority = this.editPriority.value;
        const dueDate = this.editDueDate.value;
        const startTime = this.editStartTime.value;
        const endTime = this.editEndTime.value;
        
        if (!title.trim()) {
            this.showNotification('Please enter a task title!', 'error');
            return;
        }
        
        if (startTime && endTime && startTime >= endTime) {
            this.showNotification('End time must be after start time!', 'error');
            return;
        }
        
        this.updateTodo(id, { 
            title, 
            description, 
            priority, 
            dueDate: dueDate || null, 
            startTime: startTime || null, 
            endTime: endTime || null 
        });
        this.closeEditModal();
        this.render();
        this.updateStats();
    }

    openEditModal(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.editId.value = todo.id;
            this.editTitle.value = todo.title;
            this.editDescription.value = todo.description;
            this.editPriority.value = todo.priority;
            this.editDueDate.value = todo.dueDate || '';
            this.editStartTime.value = todo.startTime || '';
            this.editEndTime.value = todo.endTime || '';
            this.editModal.style.display = 'block';
            this.editTitle.focus();
        }
    }

    closeEditModal() {
        this.editModal.style.display = 'none';
        this.editForm.reset();
    }

    showConfirmModal(message, callback) {
        this.confirmMessage.textContent = message;
        this.confirmCallback = callback;
        this.confirmModal.style.display = 'block';
    }

    closeConfirmModal() {
        this.confirmModal.style.display = 'none';
        this.confirmCallback = null;
    }

    executeConfirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.closeConfirmModal();
    }

    markAllDone() {
        const pendingTodos = this.todos.filter(todo => !todo.completed);
        if (pendingTodos.length === 0) {
            this.showNotification('No pending tasks to mark as done!', 'info');
            return;
        }
        
        this.showConfirmModal(
            `Mark ${pendingTodos.length} task(s) as completed?`,
            () => {
                pendingTodos.forEach(todo => {
                    todo.completed = true;
                    todo.updatedAt = new Date().toISOString();
                });
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.showNotification(`${pendingTodos.length} task(s) marked as completed!`, 'success');
            }
        );
    }

    clearCompleted() {
        const completedTodos = this.todos.filter(todo => todo.completed);
        if (completedTodos.length === 0) {
            this.showNotification('No completed tasks to clear!', 'info');
            return;
        }
        
        this.showConfirmModal(
            `Delete ${completedTodos.length} completed task(s)?`,
            () => {
                this.todos = this.todos.filter(todo => !todo.completed);
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.showNotification(`${completedTodos.length} completed task(s) deleted!`, 'success');
            }
        );
    }

    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('No tasks to clear!', 'info');
            return;
        }
        
        this.showConfirmModal(
            `Delete all ${this.todos.length} task(s)?`,
            () => {
                const count = this.todos.length;
                this.todos = [];
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.showNotification(`All ${count} task(s) deleted!`, 'success');
            }
        );
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.style.display = 'none';
            this.emptyState.style.display = 'block';
        } else {
            this.todoList.style.display = 'block';
            this.emptyState.style.display = 'none';
            
            this.todoList.innerHTML = filteredTodos
                .map(todo => this.createTodoHTML(todo))
                .join('');
            
            // Attach event listeners to new elements
            this.attachTodoEventListeners();
        }
    }

    createTodoHTML(todo) {
        const createdDate = new Date(todo.createdAt).toLocaleDateString();
        const createdTime = new Date(todo.createdAt).toLocaleTimeString();
        
        // Time status calculation
        const timeStatus = this.getTimeStatus(todo);
        const timeClasses = `${timeStatus.isOverdue ? 'overdue' : ''} ${timeStatus.isDueToday ? 'due-today' : ''}`;
        
        // Generate time information HTML
        const timeInfoHTML = this.generateTimeInfoHTML(todo, timeStatus);
        
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority} ${timeClasses}" data-id="${todo.id}">
                <div class="todo-header">
                    <div class="todo-content">
                        <h3 class="todo-title">${this.escapeHtml(todo.title)}</h3>
                        ${todo.description ? `<p class="todo-description">${this.escapeHtml(todo.description)}</p>` : ''}
                        <div class="todo-meta">
                            <span class="priority-badge priority-${todo.priority}">${todo.priority}</span>
                            <span><i class="fas fa-calendar"></i> Created ${createdDate}</span>
                            <span><i class="fas fa-clock"></i> ${createdTime}</span>
                        </div>
                        ${timeInfoHTML}
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn ${todo.completed ? 'pending-btn' : 'complete-btn'}" 
                                onclick="app.toggleComplete('${todo.id}')"
                                title="${todo.completed ? 'Mark as Pending' : 'Mark as Complete'}">
                            <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="action-btn edit-btn" 
                                onclick="app.editTodo('${todo.id}')"
                                title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" 
                                onclick="app.deleteTodoWithConfirm('${todo.id}')"
                                title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachTodoEventListeners() {
        // Event listeners are handled through onclick attributes in the HTML
        // This method can be used for additional complex event handling if needed
    }

    getFilteredTodos() {
        let filtered = this.todos;
        
        // Apply text search
        if (this.currentSearch) {
            filtered = filtered.filter(todo => 
                todo.title.toLowerCase().includes(this.currentSearch) ||
                todo.description.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'pending':
                filtered = filtered.filter(todo => !todo.completed);
                break;
            case 'completed':
                filtered = filtered.filter(todo => todo.completed);
                break;
            case 'high':
                filtered = filtered.filter(todo => todo.priority === 'high');
                break;
            case 'today':
                filtered = filtered.filter(todo => {
                    if (!todo.dueDate) return false;
                    const today = this.getLocalDateString();
                    return todo.dueDate === today;
                });
                break;
            case 'overdue':
                filtered = filtered.filter(todo => {
                    if (!todo.dueDate || todo.completed) return false;
                    const today = this.getLocalDateString();
                    return todo.dueDate < today;
                });
                break;
            case 'upcoming':
                filtered = filtered.filter(todo => {
                    if (!todo.dueDate || todo.completed) return false;
                    const today = this.getLocalDateString();
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    const nextWeekStr = this.getLocalDateString(nextWeek);
                    return todo.dueDate > today && todo.dueDate <= nextWeekStr;
                });
                break;
        }
        
        return filtered;
    }

    // Time utility functions
    getTimeStatus(todo) {
        // Use local date instead of UTC for today calculation
        const today = this.getLocalDateString();
        const now = new Date();
        
        let isOverdue = false;
        let isDueToday = false;
        let daysUntilDue = null;
        
        if (todo.dueDate && !todo.completed) {
            const dueDate = new Date(todo.dueDate);
            const todayDate = new Date(today);
            
            isOverdue = todo.dueDate < today;
            isDueToday = todo.dueDate === today;
            
            if (!isOverdue) {
                const timeDiff = dueDate.getTime() - todayDate.getTime();
                daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
        }
        
        return {
            isOverdue,
            isDueToday,
            daysUntilDue
        };
    }



    generateTimeInfoHTML(todo, timeStatus) {
        let timeInfoHTML = '';
        
        if (todo.dueDate || todo.startTime || todo.endTime) {
            timeInfoHTML += '<div class="time-info">';
            
            // Due date information
            if (todo.dueDate) {
                const dueDate = new Date(todo.dueDate);
                const dayOfWeek = dueDate.toLocaleDateString('en', { weekday: 'short' }).toUpperCase();
                const formattedDate = dueDate.toLocaleDateString();
                
                let dueDateClass = '';
                let dueDateText = '';
                
                if (timeStatus.isOverdue && !todo.completed) {
                    dueDateClass = 'overdue';
                    dueDateText = 'Overdue';
                } else if (timeStatus.isDueToday) {
                    dueDateClass = 'due-today';
                    dueDateText = 'Due Today';
                } else if (timeStatus.daysUntilDue !== null) {
                    dueDateClass = 'upcoming';
                    dueDateText = `${timeStatus.daysUntilDue} day${timeStatus.daysUntilDue !== 1 ? 's' : ''} left`;
                }
                
                timeInfoHTML += `
                    <div class="time-item ${dueDateClass}">
                        <i class="fas fa-calendar-day"></i>
                        <span>Due: ${formattedDate}</span>
                        <span class="day-badge">${dayOfWeek}</span>
                        ${dueDateText ? `<span>(${dueDateText})</span>` : ''}
                    </div>
                `;
            }
            
            // Time period information
            if (todo.startTime || todo.endTime) {
                const timeText = todo.startTime && todo.endTime ? 
                    `${todo.startTime} - ${todo.endTime}` :
                    todo.startTime ? `From ${todo.startTime}` :
                    `Until ${todo.endTime}`;
                
                timeInfoHTML += `
                    <div class="time-item">
                        <i class="fas fa-clock"></i>
                        <span>${timeText}</span>
                    </div>
                `;
            }
            
            timeInfoHTML += '</div>';
        }
        
        return timeInfoHTML;
    }

    // Public methods for onclick handlers
    toggleComplete(id) {
        this.toggleTodoComplete(id);
        this.render();
        this.updateStats();
    }

    editTodo(id) {
        this.openEditModal(id);
    }

    deleteTodoWithConfirm(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.showConfirmModal(
                `Delete task "${todo.title}"?`,
                () => {
                    this.deleteTodo(id);
                    this.render();
                    this.updateStats();
                }
            );
        }
    }

    // Statistics
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        this.totalCount.textContent = total;
        this.pendingCount.textContent = pending;
        this.completedCount.textContent = completed;
    }

    // Notifications
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }

    checkPendingNotifications() {
        const pendingTodos = this.todos.filter(todo => !todo.completed);
        const highPriorityPending = pendingTodos.filter(todo => todo.priority === 'high');
        
        // Check for overdue and due today tasks
        const today = this.getLocalDateString();
        const overdueTodos = pendingTodos.filter(todo => {
            return todo.dueDate && todo.dueDate < today;
        });
        const dueTodayTodos = pendingTodos.filter(todo => {
            return todo.dueDate && todo.dueDate === today;
        });
        
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Notify about overdue tasks (highest priority)
        if (overdueTodos.length > 0) {
            const message = overdueTodos.length === 1 ? 
                `You have ${overdueTodos.length} overdue task!` :
                `You have ${overdueTodos.length} overdue tasks!`;
            
            const lastOverdueNotification = localStorage.getItem('lastOverdueNotification');
            if (!lastOverdueNotification || (now - parseInt(lastOverdueNotification)) > oneHour) {
                this.showNotification(message, 'error');
                localStorage.setItem('lastOverdueNotification', now.toString());
            }
        }
        
        // Notify about due today tasks
        else if (dueTodayTodos.length > 0) {
            const message = dueTodayTodos.length === 1 ? 
                `You have ${dueTodayTodos.length} task due today!` :
                `You have ${dueTodayTodos.length} tasks due today!`;
            
            const lastDueTodayNotification = localStorage.getItem('lastDueTodayNotification');
            if (!lastDueTodayNotification || (now - parseInt(lastDueTodayNotification)) > oneHour) {
                this.showNotification(message, 'warning');
                localStorage.setItem('lastDueTodayNotification', now.toString());
            }
        }
        
        // Notify about high priority pending tasks (if no due date issues)
        else if (highPriorityPending.length > 0) {
            const message = highPriorityPending.length === 1 ? 
                `You have ${highPriorityPending.length} high priority task pending!` :
                `You have ${highPriorityPending.length} high priority tasks pending!`;
            
            const lastPriorityNotification = localStorage.getItem('lastPriorityNotification');
            if (!lastPriorityNotification || (now - parseInt(lastPriorityNotification)) > oneHour) {
                this.showNotification(message, 'info');
                localStorage.setItem('lastPriorityNotification', now.toString());
            }
        }
        
        // Update browser title with pending count and urgency indicator
        let titlePrefix = '';
        if (overdueTodos.length > 0) {
            titlePrefix = `🚨 ${overdueTodos.length} Overdue | `;
        } else if (dueTodayTodos.length > 0) {
            titlePrefix = `⏰ ${dueTodayTodos.length} Due Today | `;
        } else if (pendingTodos.length > 0) {
            titlePrefix = `(${pendingTodos.length}) `;
        }
        
        document.title = `${titlePrefix}Advanced TODO List`;
    }

    // Local Storage
    saveToStorage() {
        try {
            localStorage.setItem('todoApp_todos', JSON.stringify(this.todos));
        } catch (error) {
            this.showNotification('Failed to save data to local storage!', 'error');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('todoApp_todos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            this.showNotification('Failed to load data from local storage!', 'error');
            return [];
        }
    }

    // Utility Functions
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Import/Export functionality (bonus feature)
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `todos_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Todos exported successfully!', 'success');
    }

    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTodos = JSON.parse(e.target.result);
                
                if (Array.isArray(importedTodos)) {
                    this.todos = importedTodos;
                    this.saveToStorage();
                    this.render();
                    this.updateStats();
                    this.showNotification('Todos imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showNotification('Failed to import todos!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 