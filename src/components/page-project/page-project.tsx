import { Component, Prop, State, h } from '@stencil/core';
import { alertController } from '@ionic/core';
import { AuthService } from '../../services/authentication-service';
import { databaseService } from '../../services/database-service';
import { Task, TaskToEdit, ProjectToEdit } from '../../services/model';


@Component({
    tag: "page-project",
    styleUrl: "page-project.css"
})

export class PageProject {

    //VARS
    editProjectInput!: HTMLIonInputElement
    addTaskInput!: HTMLIonInputElement
    editTaskInput!: HTMLIonInputElement
    slidingItemP: HTMLIonItemSlidingElement

    //HOOKS  
    @Prop() project_id: string    

    @State() currentProject: ProjectToEdit
    @State() activeUser: any = []
    @State() tasks: Task[] = [{taskname: "", task_id: "", taskfinished: false, created: 0, project_id: ""}]
    
    @State() addingTask: boolean = false
    @State() newTask: string = ""
    @State() editTask: boolean = false
    @State() taskToEdit: TaskToEdit = {task_id: "", taskname: "", taskfinished: false}

    @State() loading: boolean = false

    //LIFECYCLE
    async componentWillLoad() {
        //console.log("component will load FROM PROJECT")
        
        this.loading = true

        this.activeUser = await AuthService.getCurrentUser()    
        await databaseService.watchTasks(this.project_id, tasks => {
            this.tasks = tasks.reverse()
            //console.log(this.tasks)
        })     
        let response = await databaseService.getProjectName(this.project_id)
        this.currentProject = {projectname: response.data().projectname, project_id: response.id}   

        
        this.loading = false
    }
    
    //FUNCTIONS
    startAddTask() {
        this.addingTask = true        
        setTimeout(() => {
            this.addTaskInput.setFocus()            
        }, 80);  
    }

    startEditTask(task) {
        
        this.slidingItemP.closeOpened()
        
        this.taskToEdit = task        
        this.editTask = true             
        setTimeout(() => {
            this.editTaskInput.setFocus()            
        }, 80);  
    }

    async saveEditedTask(task) {
        //VALIDATION
        if (task.taskname === "") {                    
            this.editTask = false
            this.taskToEdit = {task_id: "", taskname: "", taskfinished: false}                
            return
        }       
        
        //DATABASE
        this.loading = true
        await databaseService.UpdateTaskName(task.task_id, task.taskname)
        this.loading = false

        //RESET STATE
        this.editTask = false
        this.taskToEdit = {task_id: "", taskname: "", taskfinished: false}        
    }    

    async addNewTask() { 

        this.slidingItemP && this.slidingItemP.closeOpened()

        //VALIDATION     
        if (this.newTask === "") {
            this.addingTask = false            
            return
        }

        //DATABASE
        this.loading = true
        await databaseService.AddTask(this.newTask, this.project_id)
        this.loading = false
       
        //RESET STATE
        this.addingTask = false    
        this.newTask = "" 
    }

    async presentTaskDeleteAlert(task) {

        const alert = await alertController.create({
            header: 'Delete task',		  
            message: `Are you sure you want to delete "${task.taskname}"? This action cannot be undone`,
            buttons: [
                {text: "Okay", handler: () => this.deleteTask(task.task_id)},
                {text: "Cancel", handler: () => {}, role: 'cancel'}
            ]
          });
      
          await alert.present();          
    }

    async deleteTask(taskid) {
        this.loading = true
        await databaseService.DeleteTask(taskid)
        this.loading = false
        this.slidingItemP.closeOpened()
    }
    
    async setTaskDone(taskToEdit) {
        await databaseService.UpdateTaskDone(taskToEdit.task_id, !taskToEdit.taskfinished)
    }  

    renderTasks() {
        return [
            <ion-content>
                <ion-list>
                {                    
                this.tasks.map(task => ( 
                    <ion-item-sliding
                        ref={(el) => this.slidingItemP = el as HTMLIonItemSlidingElement}
                        onClick={() => {this.slidingItemP.closeOpened();}} //console.log("CLOSING") }}                
                    >                        
                        <ion-item 
                            class={task.taskfinished ? "task-item-finished" : "task-item-unfinished"}                        
                        >
                            {
                                this.editTask && task.task_id == this.taskToEdit.task_id
                                ?
                                <ion-input
                                    value={this.taskToEdit.taskname}
                                    ref={(el) => this.editTaskInput = el as HTMLIonInputElement} 
                                    onIonChange={e => {this.taskToEdit.taskname = e.detail.value}} //console.log(this.taskToEdit)}}
                                    onIonBlur={() => {this.saveEditedTask(this.taskToEdit)}}
                                    onKeyPress={(e: KeyboardEvent) => {                                
                                        if (e.key == "Enter")
                                            this.saveEditedTask(this.taskToEdit)                                                              
                                    }}
                                >
                                </ion-input>
                                :
                                <ion-label
                                    onClick={() => {this.startEditTask(task)}}
                                >
                                    <h2>{task.taskname}</h2>
                                </ion-label> 
                            }
                            
                            <ion-list slot="end" lines="none">
                                <ion-item>
                                    {
                                        task.taskfinished
                                        ?
                                        <ion-text style={{"font-size":"14px"}} color="success">Done</ion-text>
                                        :
                                        <ion-text style={{"font-size":"14px"}} color="danger">Not done</ion-text>
                                    }
                                    <ion-checkbox slot="end" color="success" checked={task.taskfinished} onIonChange={() => this.setTaskDone(task)}/>
                                </ion-item>
                            </ion-list>
                        </ion-item>   

                        <ion-item-options side="end">
                            <ion-item-option color="success" onClick={() => this.startEditTask(task)}>  
                                <ion-icon class="icon-big" slot="top" name="create-outline"></ion-icon>
                            </ion-item-option>
                            <ion-item-option color="danger"onClick={() => this.presentTaskDeleteAlert(task)}>  
                                <ion-icon class="icon-big" slot="top" name="trash-outline"></ion-icon>
                            </ion-item-option>
                         </ion-item-options>

                    </ion-item-sliding> 
                ))     
                }
                {
                    this.addingTask &&
                    this.renderNewTaskInput()
                }
                </ion-list> 
                      
            </ion-content>
        ]
    }

    renderNewTaskInput() {
        return [
            <ion-list>
                <ion-item class="task-item-unfinished">
                    <ion-input
                        ref={(el) => this.addTaskInput = el as HTMLIonInputElement} 
                        placeholder="Add new task"
                        value={this.newTask}
                        onIonChange={e => {this.newTask = e.detail.value}}
                        //onIonBlur={() => {this.addingTask = false; this.newTask = ""}}
                        onKeyPress={(e: KeyboardEvent) => {                                
                            if (e.key == "Enter")
                                this.addNewTask()                                                               
                        }}
                    ></ion-input>
                    <ion-buttons>
                        <ion-button 
                            onClick={() => {this.addNewTask()}}
                            fill="outline" 
                            color="success" 
                            slot="end"
                    >{this.newTask !== "" ? "Save" : "Cancel"}</ion-button>                        
                    </ion-buttons>
                </ion-item>
            </ion-list>
        ]
    }

    //RENDER
    render() {
        return [
            this.loading &&
            <part-loading></part-loading>  

            ,       

            <ion-header>
                <ion-toolbar color="primary">
                <ion-buttons slot="start">
                        <ion-back-button text="" defaultHref="/" />                        
                    </ion-buttons>                    
                    <ion-title class="ion-text-center">{this.currentProject.projectname}</ion-title>                                        
                </ion-toolbar>
            </ion-header>

            ,  

            this.tasks.length > 0
            ?
            this.renderTasks()
            :
            <ion-content class="ion-padding ion-text-center">
                {
                    this.addingTask 
                    ?
                    this.renderNewTaskInput()
                    :
                    <h4>No tasks so far! Add your first task</h4>                
                }                
            </ion-content>

            ,

            !this.addingTask && !this.editTask &&
            <ion-fab slot="fixed" vertical="bottom" horizontal="end" >
                <ion-fab-button color="secondary" class="add-button" onClick={() => this.startAddTask()}><ion-icon name="add-outline"></ion-icon></ion-fab-button>
            </ion-fab>
        ]
    }
}


//<ion-fab-button color="danger" onClick={this.presentProjectDeleteAlert}><ion-icon name="trash-outline"></ion-icon></ion-fab-button>