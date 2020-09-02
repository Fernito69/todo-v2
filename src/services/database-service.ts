import firebase from "firebase/app"
import "firebase/firestore"

class DatabaseService {
    private db: firebase.firestore.Firestore
    public detachListener: Function

    constructor() {
        this.init()
    }

    init() {
        this.db = firebase.firestore()
        console.log(this.db)
    }

    
    watchProjects(uid: string, handler: Function): void {
        //GETS PROJECTS FROM USER
        this.detachListener = this.db
        .collection("projects") 
        .orderBy("created", "desc")       
        .onSnapshot(querySnapshot => {
            let projects = []
            querySnapshot.forEach(doc => {                
                if (uid === doc.data().uid)
                    projects.push({...doc.data(), project_id: doc.id})
            })
            
            /*
            //GETS TASKS FROM PROJECT
            projects.forEach(async project => {
                this.detachListener = await this.db
                .collection("tasks")
                .onSnapshot(async querySnapshot => {
                    let tasks = []
                    querySnapshot.forEach(async doc => {
                        if (project.project_id === doc.data().project_id)
                            tasks.push({...doc.data(), task_id: doc.id})
                    })
                    project.tasks = tasks
                })
            })
            */
            
            handler(projects)
        })
    }

    
    async getProjectName(project_id: string): Promise<firebase.firestore.DocumentSnapshot> {
        return this.db.collection("projects").doc(project_id).get()
    }

    watchTasks(project_id: string, handler: Function): void {
        this.detachListener = this.db
        .collection("tasks")
        .orderBy("created", "desc")  
        .onSnapshot(querySnapshot => {
            let tasks = []
            querySnapshot.forEach(doc => {                
                if (project_id === doc.data().project_id)
                    tasks.push({...doc.data(), task_id: doc.id})
            })

            handler(tasks)
        })
    }

    async AddProject(projectname: string, uid: string): Promise<firebase.firestore.DocumentReference> {
        try {
            return await this.db.collection("projects").add({
                projectname,
                uid,
                created: Date.now()
            })
        } catch (error) {
            console.log(error)
        }
    }

    async AddTask(taskname: string, project_id: string): Promise<firebase.firestore.DocumentReference> {
        try {
            return await this.db.collection("tasks").add({
                taskname,
                project_id,
                taskfinished: false,
                created: Date.now()
            })
        } catch (error) {
            console.log(error)
        }
    }

    async DeleteTask(task_id: string) {
        await this.db.collection("tasks").doc(task_id).delete().then(function() {
            console.log(`${task_id} deleted`)
        }).catch(function(err) {
            console.error("error",err)
        })
        
    }

    async DeleteProject(project_id: string) {
        
        //DELETE ALL TASKS ASSOCIATED WITH PROJECT
        let  tasksFromProject = this.db.collection('tasks').where('project_id','==',project_id);
        
        tasksFromProject.get().then(async function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                await doc.ref.delete();
            });
        });

        await this.db.collection("projects").doc(project_id).delete().then(function() {
            console.log(`${project_id} deleted`)
        }).catch(function(err) {
            console.error("error",err)
        })
    }

    async UpdateProject(project_id: string, projectname: string) {
        await this.db.collection("projects").doc(project_id).update({
            projectname
        })
        .then(function() {
            console.log(`${project_id} updated`)
        }).catch(function(err) {
            console.error("error", err)
        })
    }

    async UpdateTaskDone(task_id: string, taskfinished: boolean) {
        await this.db.collection("tasks").doc(task_id).update({
            taskfinished
        })
        .then(function() {
            console.log(`${task_id} updated`)
        }).catch(function(err) {
            console.error("error", err)
        })
    }

    async UpdateTaskName(task_id: string, taskname: string) {
        await this.db.collection("tasks").doc(task_id).update({
            taskname
        })
        .then(function() {
            console.log(`${task_id} updated`)
        }).catch(function(err) {
            console.error("error", err)
        })
    }

    
}

export const databaseService = new DatabaseService()