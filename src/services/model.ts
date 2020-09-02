export interface Project {
    created: number
    uid: string
    projectname: string
    project_id: string
}

export interface ProjectToEdit {
    projectname: string
    project_id: string
}

export interface Task {
    created: number
    project_id: string
    taskname: string
    task_id: string
    taskfinished: boolean 
}

export interface TaskToEdit {
    taskname: string
    task_id: string
    taskfinished: boolean 
}