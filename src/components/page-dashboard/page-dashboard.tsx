import { Component, State, Listen, Element, h } from '@stencil/core';
import { modalController } from '@ionic/core';
import { Project } from '../../services/model';
import { avgCompletion } from "../../helpers/utils"
import { AuthService } from '../../services/authentication-service';
import { databaseService } from '../../services/database-service';
import { menuController } from '@ionic/core';
import {get} from "../../services/storage"

@Component({
    tag: "page-dashboard",
    styleUrl: "page-dashboard.css"
})

export class PageDashboard {
    
    @Element() el

    //HOOKS
    @State() projects: Project[] = []
    @State() loading: boolean = false
    @State() auth: boolean
    @State() activeUser : any
    @State() showAddButton: boolean = true
    @State() globalCompletion = {totalTasks: 0, completedTasks: 0, finalNumber: 0}

    
    //LIFECYCLE
    async componentWillLoad() {           
        this.loading = true
        this.activeUser = await AuthService.getCurrentUser()  

        await databaseService.watchProjects(this.activeUser.uid, projects => {        
            this.projects = projects.reverse()
            this.loading = false            
            avgCompletion(this.projects)
        })
        this.loading = false

        //HACK
        setTimeout(async () => {
            this.globalCompletion = await get("globalCompletion")
        }, 500)
    }      

    async componentWillRender() {
        //HACK
        setTimeout(async () => {
            this.globalCompletion = await get("globalCompletion")
        }, 500)
    }
  
    @Listen('ionRouteWillChange', { target: 'body' })
    async updateStatistics() {        
        await avgCompletion(this.projects)
        
        //HACK
        setTimeout(async () => {
            this.globalCompletion = await get("globalCompletion")
        }, 500)
    }

    @Listen("projectDeleted")
    async deleteProject(e) {
        //SET THIS TO [] IN ORDER TO TRIGGER RE-RENDER
        this.projects = []

        await databaseService.DeleteProject(e.detail)         

        await databaseService.watchProjects(this.activeUser.uid, projects => {        
            this.projects = projects.reverse()
        })
    }    
    @Listen("beginEditProject")
    hideAddButton() {
        this.showAddButton = false
    }
    @Listen("finishEditProject")
    showAgainAddButton() {
        this.showAddButton = true
    }
    
    //FUNCTIONS
    handleLogOut() {
        AuthService.logout();
        menuController.close('first');
    }   

    presentModal = async () => {
        const modal = await modalController.create({
            component: 'part-add-project-modal',
            componentProps: {
                uid: this.activeUser.uid
            },            
        })
        await modal.present();
        
        const modalData = await modal.onDidDismiss()
        this.modalDidDismiss(modalData.data)
    }

    async modalDidDismiss(data) {
        if (data !== undefined) {
            
            this.loading = true
            //DATABASE
            await databaseService.AddProject(data.projectname, data.uid)                  

            this.loading = false
        }
    }   

    openMenu() {
        menuController.enable(true, 'first');
        menuController.open('first');
    }

    printStatisticRow(statistic, value) {
        return [
            <ion-item>
                <ion-grid>
                    <ion-row>                                   
                        <ion-col size="8" style={{"font-size": "12px"}}>                            
                            <ion-text color="medium">{statistic}</ion-text>                            
                        </ion-col>
                        <ion-col class="ion-text-center" size="4" style={{"font-size": "12px"}}>
                            <ion-text>{value}</ion-text>
                        </ion-col>          
                    </ion-row>
                </ion-grid>    
            </ion-item>                    
        ]        
    }

    printPieTart(percentage: number, size: number) {                  
        return (  
            
                <div class="outer-pie" style={{
                    "background-image": `conic-gradient(green ${percentage.toString() === "NaN" ? 0 : 360 * percentage / 100}deg, red 0 360deg)`,
                    "width": `${size}px`,
                    "height": `${size}px`
                }}>
                    <div class="inner-pie"
                    style={{
                        "width": `${size/1.5}px`,
                        "height": `${size/1.5}px`,
                        "line-height": `${size*.65}px`
                    }}
                    >
                        <ion-text style={{"font-size": `${size*.15}px`}} color="dark">{`${this.globalCompletion.finalNumber}%`}</ion-text>
                    </div>
                </div>                   
        )        
    }
        
    renderMenu() {
        return [
            <ion-menu side="start" menuId="first" contentId="main">
                <ion-header>
                    <ion-toolbar color="primary">
                        <ion-title>Options</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-avatar class="item-avatar">
                                    <img src={this.activeUser.photoURL}></img>
                                </ion-avatar>
                            </ion-col>
                            <ion-col>
                                <h3>{`Hello ${this.activeUser.displayName.split(" ")[0]}!`}</h3>
                            </ion-col>
                        </ion-row>
                    </ion-grid>                       
                    <ion-list>
                        <ion-item 
                            class="ion-text-end"
                            onClick={() => this.handleLogOut()}
                        >Log out&nbsp;<ion-icon slot="end" name="log-out-outline"></ion-icon></ion-item>   
                        <ion-item>Other options (not impl.)<ion-icon slot="end" name="ellipsis-horizontal-outline"></ion-icon></ion-item> 
                        <ion-item></ion-item>
                    </ion-list>
                    <ion-item-divider color="primary">
                        <ion-label>
                            Statistics
                        </ion-label>
                    </ion-item-divider>
                    <ion-list>
                    
                        {
                            this.printStatisticRow("To-do lists:", this.projects.length)
                        }
                        {
                            this.printStatisticRow("Total tasks:", `${this.globalCompletion.totalTasks}`)
                        }
                        {
                            this.printStatisticRow("Total completed tasks:", `${this.globalCompletion.completedTasks}`)
                        }
                        {
                            this.printStatisticRow("Avg. % of completion:", this.printPieTart(+this.globalCompletion.finalNumber, 70))
                        }
                    </ion-list>

                

                </ion-content>
            </ion-menu>
        ]
    }

    //RENDER
    render() {
        
        return [
           this.renderMenu()
            ,
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title class="ion-text-center">{this.activeUser.displayName.split(" ")[0]}'s to-dos</ion-title>
                    <ion-buttons slot="start">
                        <ion-button onClick={() => this.openMenu()}>
                            <ion-icon name="menu-outline"></ion-icon>                
                        </ion-button>                        
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>

            ,    
                                   
            this.projects.length > 0
            ?
            <ion-content id="main"> 
                <ion-list>
                    {                    
                    this.projects.map(project => (                        
                        <part-project-snippet
                            project_id={project.project_id}
                            projectname={project.projectname}
                        >
                        </part-project-snippet>                        
                    ))
                    }
                </ion-list>
            </ion-content>
            :
            <ion-content id="main" class="ion-padding ion-text-center">
                <h4>No to-do lists so far! Add your first list</h4>                
            </ion-content>                  
            
            ,
            
            this.showAddButton &&
            <ion-fab slot="fixed" vertical="bottom" horizontal="end" >
                <ion-fab-button onClick={this.presentModal}><ion-icon name="add-outline"></ion-icon></ion-fab-button>
            </ion-fab>

            ,   

            this.loading &&
            <part-loading></part-loading> 
        ]
    }
}

