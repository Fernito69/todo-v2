import { Component, Prop, State,Event, h } from '@stencil/core';
import { databaseService } from '../../services/database-service';
import {completionPercentage} from "../../helpers/utils"
import { Task, ProjectToEdit } from '../../services/model';
import { alertController } from '@ionic/core';
import { EventEmitter } from '@ionic/core/dist/types/stencil-public-runtime';

@Component({
    tag: "part-project-snippet",
    styleUrl: "part-project-snippet.css"
})

export class PartProjectSnippet {
    
    editProjectInput!: HTMLIonInputElement
    slidingItem!: HTMLIonItemSlidingElement
    
    @Prop() project_id: string
    @Prop() projectname: string

    @State() tasks: Task[] = [{taskname: "", project_id: "", created: 0, task_id: "", taskfinished: false}]
    @State() editingProject: boolean = false
    @State() projectToEdit: ProjectToEdit = {project_id: this.project_id, projectname: this.projectname}

    @Event() projectDeleted: EventEmitter
    @Event() beginEditProject: EventEmitter
    @Event() finishEditProject: EventEmitter

    async componentWillLoad() {
        await databaseService.watchTasks(this.project_id, tasks => {
            this.tasks = tasks.reverse()
            //console.log(`FROM componentWillLoad ${this.projectname}`)
            //console.log(this.tasks)
        })     
    }

    pieChart(percentage: number) {                
        return (            
            <div class="outer-pie" style={{
                "background-image": `conic-gradient(green ${percentage.toString() === "NaN" ? 0 : 360 * percentage / 100}deg, red 0 360deg)` 
            }}>
                <div class="inner-pie"> 
                </div>
            </div> 
        )
    }

    startEditProject() {
        this.editingProject = true
        this.beginEditProject.emit()        

        setTimeout(() => {
            this.editProjectInput.setFocus()            
        }, 120);        
    }

    async presentProjectDeleteAlert() {
        const alert = await alertController.create({
            header: 'Delete project',		  
            message: `Are you sure you want to delete "${this.projectToEdit.projectname}"? This action cannot be undone`,
            buttons: [
                {text: "Okay", handler: () => this.deleteProject()},
                {text: "Cancel", handler: () => {}, role: 'cancel'}
            ]
        });
      
        await alert.present();
    }

    async deleteProject() {
        this.projectDeleted.emit(this.project_id)
        this.slidingItem.close()
    }

    async saveProject() {
        //VALIDATION              
        if (this.projectToEdit.projectname === "") {
            this.editingProject = false
            this.projectToEdit = {project_id: this.project_id, projectname: this.projectname}
            this.finishEditProject.emit()
            return
        }

        //DATABASE
        await databaseService.UpdateProject(this.project_id, this.projectToEdit.projectname)

        //RESET STATE
        this.editingProject = false    
        this.finishEditProject.emit()
    }

    renderSlidingItem() {
        return [
            <ion-item-sliding
                ref={(el) => this.slidingItem = el as HTMLIonItemSlidingElement}
                onClick={() => this.slidingItem.close()}                
            >         
                <ion-item 
                    href={`/project/${this.project_id}`}
                    routerDirection="forward"
                    class="project-item"
                >
                    <ion-grid>
                        <ion-row>
                            <ion-col size="8.5">
                                <ion-label>
                                    <h2>{this.projectname}</h2>
                                    <h3>{`
                                        ${this.tasks[0] !== undefined ? this.tasks.length : "No"} 
                                        ${this.tasks.length === 1 ? " task" :
                                        this.tasks[0] !== undefined ? " tasks" : " tasks so far"}
                                        `}
                                    </h3>
                                </ion-label>          
                            </ion-col>
                            <ion-col size="1.5" class="pie-container ion-text-center">
                                {this.pieChart(completionPercentage(this.tasks))}
                            </ion-col>
                            <ion-col size="2" class="pie-container ion-text-center">
                                    <p>
                                       {`${
                                        this.tasks[0] !== undefined 
                                        ?
                                        completionPercentage(this.tasks)
                                        :
                                        "0"}% compl.`}
                                    </p>
                            </ion-col>
                        </ion-row>
                    </ion-grid>                                                      
                </ion-item>
                
                <ion-item-options side="end">
                    <ion-item-option color="success" onClick={() => this.startEditProject()}>  
                        <ion-icon class="icon-big" slot="top" name="create-outline"></ion-icon>
                    </ion-item-option>
                    <ion-item-option color="danger"onClick={() => this.presentProjectDeleteAlert()}>  
                        <ion-icon class="icon-big" slot="top" name="trash-outline"></ion-icon>
                    </ion-item-option>
                </ion-item-options>

            </ion-item-sliding>
        ]
    }

    renderInput() {
        return [
            <ion-item class="project-item">
                <ion-label>
                    <ion-input
                        ref={(el) => this.editProjectInput = el as HTMLIonInputElement} 
                        onIonBlur={() => this.saveProject()}
                        onKeyPress={(e: KeyboardEvent) => {
                            if (e.key == "Enter")
                                this.saveProject()
                        }}
                        type="text"
                        value={this.projectToEdit.projectname}
                        onIonChange={e => {this.projectToEdit.projectname = e.detail.value}}
                    >
                    </ion-input>
                    <h3><ion-skeleton-text animated style={{"width": "25%"}}></ion-skeleton-text></h3>                    
                </ion-label>            
            </ion-item>
        ]
    }

    render() {
        return [
            !this.editingProject
            ?
            this.renderSlidingItem()
            :
            this.renderInput()
        ]        
    }
}

//"width": "8px", "height": "8px", "margin-left": "auto", "margin-right": "auto", "margin-top": "auto", "margin-bottom": "auto", "border-radius": "50%", "background-image": `conic-gradient(white 0 360deg)`