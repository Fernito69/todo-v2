import { Component, Prop, State, Element, h } from '@stencil/core';
import AppState from "../../services/services"
import {callTasks} from "../../dbinteractions"
import {editAndSaveProject} from "../../dbinteractions"

@Component({
    tag: "app-project",
    styleUrl: "app-project.css"
})

export class AppProject {

    //LIFECYCLE
    componentWillLoad() {
        console.log("component will load FROM PROJECT")
        //console.log(AppState.activeProject())

        //CHECK FOR AUTH
        if (AppState.auth() !== true) {
            this.navCtrl = document.querySelector("ion-router")
            this.navCtrl.push("/", "forward")
            return
        }

        //GETS PROJECTS FROM USER
        if (AppState.auth()) {
            this.callTasksFromProject()       
        }                 
    }

    componentWillRender() {
        console.log("component will render FROM PROJECT")
    }

    //VARS
    private navCtrl: HTMLIonRouterElement
    editProjectInput!: HTMLIonInputElement;

    //HOOKS
    @Element() el: HTMLElement

    @Prop() project_id: string
    
    @State() tasks: Array<{
        taskname: string
        task_id: string
        taskfinished: boolean
    }> = [{taskname: "", task_id: "", taskfinished: false}]
    @State() loading: boolean = false
    @State() editingProject: boolean = false
    @State() projectToEdit: {
        projectname: string
        project_id: string
    } = {...AppState.activeProject()}    

    //FUNCTIONS
    handleLogOut() {
        AppState.setAuth(false)
        AppState.setActiveUser({
            name: "",
            id: "",
            email: "",
        })
        AppState.setActiveProject({
            projectname: "",
            project_id: ""
        })
        this.project_id = ""
        this.navCtrl = document.querySelector("ion-router")
        this.navCtrl.push("/", "forward")
    }

    async callTasksFromProject() {
        this.loading = true

        const queryResult = await callTasks(AppState.activeUser(), this.project_id)

        this.loading = false
        
        this.tasks = queryResult.data
        //console.log(this.tasks)
        //console.log(AppState.activeProject())
        //console.log(this.tasks.length)
    }

    saveProject = async () => {
        //ADD VALIDATION (no "")     
        console.log(this.projectToEdit)   
        if (this.projectToEdit.projectname === "") {
            this.editingProject = false
            this.projectToEdit = {...AppState.activeProject()}
            return
        }
        
        //create new object with user id
        
        const finalObject = {
            _id: this.projectToEdit.project_id,
            projectname: this.projectToEdit.projectname,
            user_id: AppState.activeUser().id
        }

        console.log(finalObject)

        //DATABASE
        await editAndSaveProject(finalObject)

        //STATE TO ""
        this.editingProject = false    
        AppState.setActiveProject(this.projectToEdit)
        console.log(AppState.activeProject())
    }

    startEditProject() {
        this.editingProject = true
        
        setTimeout(() => {
            this.editProjectInput.setFocus()
            console.log(this.editProjectInput)
        }, 50);        
    }

    render() {
        return [
            this.loading &&
            <app-loading></app-loading>            
            ,
            <ion-header>
                <ion-toolbar color="primary">
                <ion-buttons slot="start">
                        <ion-button href="/dashboard/2" routerDirection="forward">
                            <ion-icon slot="end" name="caret-back-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                    {
                    this.editingProject
                    ?
                    <ion-input
                        onKeyPress={(e: KeyboardEvent) => {
                            if (e.key == "Enter")
                                this.saveProject()
                        }}
                        ref={(el) => this.editProjectInput = el as HTMLIonInputElement} 
                        onIonBlur={this.saveProject}
                        class="edit-project"
                        id="hola"
                        type="text"
                        value={this.projectToEdit.projectname}
                        onIonChange={e => {this.projectToEdit.projectname = e.detail.value}} //;console.log(AppState.activeProject()) }}
                    ></ion-input>
                    :
                    <ion-title class="ion-text-start">{this.projectToEdit.projectname}</ion-title>
                    }                    
                    <ion-buttons slot="primary">
                        {
                        this.editingProject
                        ?
                        <ion-button fill="solid" color="success" onClick={this.saveProject}>
                            <ion-icon name="save-outline"></ion-icon>
                        </ion-button>
                        :
                        <ion-button fill="clear" color="success" onClick={() => this.startEditProject()}>
                            <ion-icon name="create-outline"></ion-icon>
                        </ion-button>    
                        }
                        
                        
                    </ion-buttons>
                    <ion-buttons slot="end">
                        <ion-button onClick={this.handleLogOut}>
                            <ion-icon name="log-out-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            ,  
            this.tasks.length > 0
            ?
            <ion-content>
                {
                this.tasks.map(task => (
                    <ion-list class="project-item">
                        <ion-item onClick={() => {}}>
                            <ion-label>
                                <h2>{task.taskname}</h2>
                            </ion-label>                                            
                        </ion-item>
                    </ion-list>
                ))     
                }       
            </ion-content>
            :
            <ion-content class="ion-padding ion-text-center">
                <h2>No tasks so far! Add your first task</h2>                
            </ion-content>
        ]
    }
}

/*<ion-button color="danger" onClick={()=>{}}>
<ion-icon name="trash-outline"></ion-icon>
</ion-button>*/