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
            console.log("Task not found")
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

class TaskRenderer {}


const manager = new TaskManager()

manager.addTask("Walk the dog")
manager.addTask("Walk the cat")
manager.addTask("Walk the fish")
manager.addTask("Walk the bird")
manager.removeTask(2)
manager.toggleTask(1)

console.table(manager.tasks)
console.table(manager.getCompleted())
console.table(manager.getActive())

