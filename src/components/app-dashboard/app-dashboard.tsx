import { Component, Prop, State, Listen, Element, h, Event, Watch } from '@stencil/core';
import { modalController } from '@ionic/core';
import AppState from "../../services/services"
import {callProjectsAndTasks} from "../../dbinteractions"
import {completionPercentage} from "../../helpers/utils"
import {saveNewProject} from "../../dbinteractions"


@Component({
    tag: "app-dashboard",
    styleUrl: "app-dashboard.css"
})

export class AppDashboard {

    @Element() el: any;

    //VARS
    private navCtrl: HTMLIonRouterElement

    //STATE
    @State() projects: Array<{
        projectname: string
        project_id: string
        tasks: Array<{
            taskname: string
            task_id: string
            taskfinished: boolean
        }>
    }> = [{projectname: "", project_id: "", tasks: [{taskname: "", task_id: "", taskfinished: false}]}]
    @State() loading: boolean = false
    @State() auth: boolean
    @State() activeUser : {
        name: string
        id: string
        email: string
    }
    
   
    //LISTEN
    @Listen('ionModalDidDismiss', { target: 'body' })
    async modalDidDismiss(e: CustomEvent) {
        if (e) {
            if (e.detail.data !== undefined) {
                //DATABASE        
                this.loading = true
                await saveNewProject(e.detail.data)
                this.loading = false
                this.callProjectsAndTasksFromUser(this.activeUser)
            }
        }
    }

    componentWillLoad() {   
        this.activeUser = AppState.activeUser()
        this.auth = AppState.auth()        

        console.log(`component will load DASHBOARD`)

        //CHECK FOR AUTH
        if (!this.auth) {
            this.navCtrl = document.querySelector("ion-router")
            this.navCtrl.push("/", "back")
            return
        }

        //GETS PROJECTS FROM USER
        if (this.auth)
            this.callProjectsAndTasksFromUser(this.activeUser)                      
    }


    //FUNCTIONS
    handleLogOut() {
        AppState.setAuth(false)
        this.auth = false
        AppState.setActiveUser({
            name: "",
            id: "",
            email: "",
        })
        this.activeUser = {
            name: "",
            id: "",
            email: "",
        }
        AppState.setActiveProject({
            projectname: "",
            project_id: ""
        })
        
        this.projects = [{projectname: "", project_id: "", tasks: [{taskname: "", task_id: "", taskfinished: false}]}]
        this.navCtrl = document.querySelector("ion-router")
        this.navCtrl.push("/", "forward")        
    }

    async callProjectsAndTasksFromUser(user) {
        this.loading = true
        const queryResult = await callProjectsAndTasks(user)
        this.loading = false
        //add if in case of error?
        this.projects = queryResult
    }

    goToProject(proj) {
        AppState.setActiveProject({
            projectname: proj.projectname,
            project_id: proj.project_id
        })
        this.navCtrl = document.querySelector("ion-router")
        this.navCtrl.push(`/project/${proj.project_id}`, "forward")
    }

    async presentModal() {
        const modal = await modalController.create({
            component: 'app-add-project-modal',
            componentProps: {
                user_id: AppState.activeUser().id
            }
        })
        await modal.present();
    }

    //RENDER
    render() {
        return [
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title class="ion-text-center">{this.activeUser.name}'s projects</ion-title>
                    <ion-buttons slot="end">
                        <ion-button onClick={this.handleLogOut}>
                            <ion-icon name="log-out-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
            ,               
            //this.projects[0].projectname !== ""
            this.projects.length > 0
            ?
            <ion-content> 
                {
                this.projects.map(project => (
                    <ion-list  class="project-item">
                        <ion-item onClick={() => this.goToProject(project)}>
                            <ion-icon slot="end" name="caret-forward-outline"></ion-icon>
                            <ion-label>
                                <h2>{project.projectname}</h2>
                                <h3>{`${
                                    project.tasks[0] !== undefined 
                                    ?
                                    project.tasks.length
                                    :
                                    "No"} 
                                    ${
                                    project.tasks.length === 1
                                    ?
                                    " task"
                                    :
                                    project.tasks[0] !== undefined
                                    ?
                                    " tasks"
                                    :
                                    " tasks yet"
                                    }`}
                                </h3>
                                <p>{`${
                                    project.tasks[0] !== undefined 
                                    ?
                                    completionPercentage(project.tasks)
                                    :
                                    "0"}% completion`}
                                </p>
                            </ion-label>                                            
                        </ion-item>
                    </ion-list>
                ))
                }
            </ion-content>
            :
            <ion-content class="ion-padding ion-text-center">
            <h2>No projects so far! Add your first project</h2>                
            </ion-content>                  
            
            ,
            <ion-fab slot="fixed" vertical="bottom" horizontal="end" >
                <ion-fab-button onClick={this.presentModal}><ion-icon name="add-outline"></ion-icon></ion-fab-button>
            </ion-fab>
            ,            
            this.loading &&
            <app-loading></app-loading> 
        ]
    }
}

/* <div class="spinner-container">
                        <div class="spinner-container2">
                            <ion-spinner color="dark" class="loading-spinner"></ion-spinner>
                        </div>
                    </div>
                     */