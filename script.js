const taskInput = document.getElementById("task-input")
const addButton = document.getElementById("add-button")
const tasksList = document.getElementById("tasks-list")

class Task {
    constructor(id,title) {
        this.id = id;
        this.title = title;
        this.complete = false;
        this.createdAt = new Date();
    }

    toggle() {
        this.complete = !this.complete
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title) {
        let id = this.tasks.length + 1
        let task = new Task(id, title)
        this.tasks.push(task)
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id)
    }

    toggleTask(id) {
        let item = this.tasks.find(task => task.id === id)
        if (!item) {
            alert("Task not found")
            return
        }

        item.toggle()
    }

    getCompleted() {
        return this.tasks.filter(task => task.complete)
    }

    getActive() {
        return this.tasks.filter(task => !task.complete)
    }

}

class StorageService {
    static save(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    static load() {
        const items =JSON.parse(localStorage.getItem("tasks"))
        if (Array.isArray(items)) {
            return items.map(item => {
                let task = new Task(item.id, item.title)
                task.complete = item.complete
                task.createdAt = new Date(item.createdAt)
                return task
            })
        }
        return []
    }
}

class TaskRenderer {
    constructor() {
        this.tasks = StorageService.load()
    }

    render() {
        this.tasks.forEach(task => {
            let li = document.createElement("li")
            li.classList.add("task-item")
            li.dataset.id = task.id
            li.innerHTML = `
                <input type="checkbox" ${task.complete ? "checked" : ""}>
                <span class="task-title">${task.title}</span>
                <span class="task-date">${task.createdAt.toLocaleDateString()}</span>
                <button class="delete-button">❌</button>
            `
            tasksList.appendChild(li)
        })
    }
}



