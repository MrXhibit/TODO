# 📝 Advanced TODO List Application

A feature-rich, modern TODO list application built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

### Core Functionality
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Mark as Done/Pending**: Toggle task completion status
- **Time Management**: Due dates, start/end times, day tracking
- **Smart Notifications**: Overdue alerts, due today warnings, priority reminders
- **Local Storage**: Data persists across browser sessions

### Advanced Features
- **Time-Based Filtering**: Due today, overdue, upcoming tasks
- **Search & Filter**: Find tasks by keywords, status, or priority
- **Priority Levels**: High, Medium, Low with color coding
- **Smart Scheduling**: Due dates with day-of-week display
- **Time Periods**: Start and end time tracking
- **Bulk Actions**: Mark all done, clear completed, clear all
- **Statistics**: Real-time counters for tasks
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Glass morphism, gradients, and smooth animations

## 🎯 How to Use

### Adding Tasks
1. Enter a task title (required)
2. Add an optional description
3. Set due date (optional) - choose when the task should be completed
4. Add time period (optional) - set start and/or end times
5. Select priority level (Low, Medium, High)
6. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Click the green checkmark button
- **Edit**: Click the yellow edit button to modify
- **Delete**: Click the red trash button (with confirmation)
- **Mark as Pending**: Click the gray undo button on completed tasks

### Search & Filter
- **Search**: Type in the search box to find tasks by title/description
- **Filter Buttons**: 
  - All: Show all tasks
  - Pending: Show incomplete tasks only
  - Completed: Show finished tasks only
  - High Priority: Show high-priority tasks only
  - Due Today: Show tasks due on current date
  - Overdue: Show tasks past their due date
  - Upcoming: Show tasks due within next 7 days

### Bulk Actions
- **Mark All Done**: Complete all pending tasks at once
- **Clear Completed**: Remove all finished tasks
- **Clear All**: Delete all tasks (with confirmation)

### Notifications
- Success notifications for all actions
- 🚨 Overdue task alerts (red notifications, highest priority)
- ⏰ Due today warnings (yellow notifications)
- 💡 High-priority task reminders (blue notifications)  
- Browser title shows overdue/due today counts with emojis
- Hourly notification system prevents spam

## 🛠️ Technical Details

### File Structure
```
TODO/
├── index.html      # Main HTML structure
├── style.css       # Styles with responsive design
├── script.js       # JavaScript functionality
└── README.md       # This documentation
```

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript ES6+**: Class-based architecture
- **Local Storage**: Data persistence
- **Font Awesome**: Icons

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🎨 Design Features

- **Glass Morphism**: Semi-transparent backgrounds with blur effects
- **Gradient Backgrounds**: Modern purple-blue gradient
- **Smooth Animations**: Hover effects and transitions
- **Color-Coded Priorities**: Visual priority indicators
- **Responsive Layout**: Mobile-first design

## 🔧 Customization

### Priority Colors
- **High Priority**: Red border and badge
- **Medium Priority**: Yellow border and badge
- **Low Priority**: Green border and badge

### Notification Types
- **Success**: Green (task operations)
- **Error**: Red (validation errors)
- **Warning**: Yellow (pending task alerts)
- **Info**: Blue (general information)

## 📱 Mobile Experience

The application is fully responsive and includes:
- Touch-friendly buttons
- Optimized layouts for small screens
- Swipe-friendly modal dialogs
- Readable text sizes

## 🔄 Data Management

- **Auto-save**: All changes saved automatically
- **Data Recovery**: Survives browser restarts
- **Error Handling**: Graceful fallbacks for storage issues

## 🚀 Getting Started

1. Open `index.html` in any modern web browser
2. Start adding your tasks
3. Enjoy a clutter-free productivity experience!

## 📋 Keyboard Shortcuts

- **ESC**: Close any open modal
- **Enter**: Submit forms
- **Tab**: Navigate between form fields

## 🌟 Pro Tips

1. Use high priority for urgent tasks to get notifications
2. Add descriptive titles for better search functionality
3. Use the search feature to quickly find specific tasks
4. Regular cleanup with "Clear Completed" keeps the list organized
5. The statistics show your productivity at a glance

---

**Enjoy your enhanced productivity with this advanced TODO list! 🎉** 