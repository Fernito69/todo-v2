import { Component, State, h, Listen } from '@stencil/core';
import {AuthService} from "../../services/authentication-service"
import {set} from "../../services/storage"


@Component({
    tag: "page-login",
    styleUrl: "page-login.css"
  })

export class PageLogin {

    @State() user: any = {}
    
    //LIFECYCLE
    async componentWillLoad() {
        // Listen to Authentication Changes
        AuthService.onAuthStateChange(user => {
          if (!!user && !user.isAnonymous) {
            document.querySelector("ion-router").push('/dashboard');
          } else {
            document.querySelector("ion-router").push('/');
          }
          this.user = user
        });

        //reset stats
        await set("globalCompletion", {totalTasks: 0, completedTasks: 0, finalNumber: 0})
    }

    @Listen('ionRouteWillChange', { target: 'body' })
    async updateStatistics() {   
        //reset stats
        await set("globalCompletion", {totalTasks: 0, completedTasks: 0, finalNumber: 0})
    }     

    //@ts-ignore
    async authenticate(event, provider) {
        return AuthService.signInWithPopup(provider);
    }

    ////////
    //RENDER
    ////////
    render() {
        return [	
           
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title class="ion-text-center" size="large">To-do</ion-title>
                </ion-toolbar>
            </ion-header>

            ,

            <ion-content class="ion-text-center ion-padding">
           
                <ion-button 
                    type="submit" 
                    color="primary" 
                    onClick={ev => {this.authenticate(ev, AuthService.getAuthProviders().google);}} //console.log(this.user)}}
                >
                    <ion-icon name="logo-google"></ion-icon>
                    &nbsp;Login with Google
                </ion-button>
            
            </ion-content>
        ]
    }
}

