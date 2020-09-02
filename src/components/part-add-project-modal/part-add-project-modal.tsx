import { Component, Prop, h, Element, State } from '@stencil/core';
import {presentSimpleAlert} from "../../helpers/utils"


@Component({
    tag: 'part-add-project-modal',
    styleUrl: 'part-add-project-modal.css',
})
export class PartAddProjectModal {

    //VARS    
    projectInput!: HTMLIonInputElement    

    //LIFECYCLE
    componentDidRender() {
        
        setTimeout(() => {
            this.projectInput.setFocus()            
        }, 800);
    }

    //HOOKS
    @Element() el: any;

    @Prop() uid: string

    @State() newProject: string = ""
    @State() loading: boolean = true

    
    //FUNCTIONS    
    dismiss(data?: any) {        
        (this.el.closest('ion-modal') as any).dismiss(data);
    }

    addNewProject = async () => {
        
        //ADD VALIDATION (no "")
        if (this.newProject === "") {
            presentSimpleAlert("Error", "The project must have a name!")
            return
        }
        
        //create new object with user id
        const finalObject = {
            projectname: this.newProject,
            uid: this.uid
        }

        //STATE TO ""        
        this.newProject = ""
        
        //CLOSE MODAL
        this.dismiss(finalObject)    
    }


    //RENDER
    render() {
        return [
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title class="ion-text-center">Add new project</ion-title>
                </ion-toolbar>
            </ion-header>
            
            ,

            <ion-item>
                <ion-label position="floating">Project name</ion-label>
                <ion-input
                    ref={(el) => this.projectInput = el as HTMLIonInputElement} 
                    value={this.newProject}
                    onIonChange={(e: CustomEvent) => {this.newProject = e.detail.value}}
                    onKeyPress={(e: KeyboardEvent) => {
                        if (e.key == "Enter")
                            this.addNewProject()
                        if (e.key == "Escape")
                            this.dismiss()
                    }}
                ></ion-input>
            </ion-item>
            
            ,
            
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-button size="small" color="success" onClick={this.addNewProject}>Save</ion-button>
                    </ion-col>
                    <ion-col>
                        <ion-button size="small" color="danger" onClick={() => this.dismiss()}>Cancel</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
        ]
    }
    
}