import { Component, Prop, State, Listen, h } from '@stencil/core';
import AppState from "../../services/services"
import {callTasks} from "../../dbinteractions"

@Component({
    tag: "app-project",
    styleUrl: "app-project.css"
})

export class AppProject {

    private navCtrl: HTMLIonRouterElement
    
    @Prop() project_id: string
    
    @State() tasks: Array<{
        taskname: string
        task_id: string
        taskfinished: boolean
    }> = [{taskname: "", task_id: "", taskfinished: false}]
    @State() loading: boolean = false

    componentWillLoad() {
        console.log("component will load PROJECT")
        //CHECK FOR AUTH
        if (AppState.auth() !== true) {
            this.navCtrl = document.querySelector("ion-router")
            this.navCtrl.push("/", "forward")
            return
        }

        //GETS PROJECTS FROM USER
        if (AppState.auth())
            this.callTasksFromProject()                
    }

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

    render() {
        return [
            this.loading &&
            <app-loading></app-loading>
            ,
            <ion-header>
                <ion-toolbar color="primary">
                <ion-buttons slot="start">
                        <ion-button href="/dashboard" routerDirection="back">
                            <ion-icon slot="end" name="caret-back-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                    <ion-title class="ion-text-center">{AppState.activeProject().projectname}</ion-title>
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