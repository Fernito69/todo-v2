import { Component, State, h } from '@stencil/core';
import {AuthService} from "../../services/authentication-service"


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

