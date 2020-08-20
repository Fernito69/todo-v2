import { Component, Prop, h, Element, Event, EventEmitter, State } from '@stencil/core';
import {presentSimpleAlert} from "../../helpers/utils"


@Component({
    tag: 'app-add-project-modal',
    styleUrl: 'app-add-project-modal.css',
})
export class AppAddProjectModal {
    
    @Element() el: any;

    //PROPS
    @Prop() user_id: string

    //STATE
    @State() newProject: string = ""
    @State() loading: boolean = true

    //EVENTS
    @Event() onProjectSaved: EventEmitter

    //FUNCTIONS
    /*
    dismissModal() {
        modalController.dismiss({
            'dismissed': true
        });
    }*/
    dismiss(data?: any) {
        // dismiss this modal and pass back data
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
            user_id: this.user_id
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
                    autofocus
                    value={this.newProject}
                    onIonChange={(e: CustomEvent) => {this.newProject = e.detail.value}}
                ></ion-input>
            </ion-item>,
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