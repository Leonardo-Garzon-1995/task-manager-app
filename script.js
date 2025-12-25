const taskInput = document.getElementById("task-input")
const addButton = document.getElementById("add-button")
const tasksList = document.getElementById("tasks-list")

class Task {
    constructor(id, title) {
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
        this.tasks = StorageService.load();
    }

    addTask(title) {
        let id = crypto.randomUUID()
        let task = new Task(id, title)
        this.tasks.push(task)
        this.saveTasks()
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.saveTasks()
    }

    toggleTask(id) {
        let item = this.tasks.find(task => task.id === id)
        item.toggle()
        this.saveTasks()
    }

    getCompleted() {
        return this.tasks.filter(task => task.complete)
    }

    getActive() {
        return this.tasks.filter(task => !task.complete)
    }

    saveTasks() {
        StorageService.save(this.tasks)
    }

}

class StorageService {
    static save(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    static load() {
        const items = JSON.parse(localStorage.getItem("tasks"))
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

    render(tasks) {
        tasksList.innerHTML = ""
        tasks.forEach(task => {
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

const manager = new TaskManager()
const renderer = new TaskRenderer()

renderer.render(manager.tasks)


addButton.addEventListener("click", () => {
    let title = taskInput.value
    if (title) {
        manager.addTask(title)
        taskInput.value = ""
        renderer.render(manager.tasks)
    }
})

taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addButton.click()
    }
})

tasksList.addEventListener("click", e => {
    const li = e.target.closest("li")
    if (!li) return

    const id = li.dataset.id

    if (e.target.type === "checkbox") {
        manager.toggleTask(id)
        
    }

    if (e.target.classList.contains("delete-button")) {
        manager.removeTask(id)
        
    }

    renderer.render(manager.tasks)
})

