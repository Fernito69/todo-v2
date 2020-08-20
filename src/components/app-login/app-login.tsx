import { Component, State, Event, h } from '@stencil/core';
import AppState from "../../services/services"
import {logIn} from "../../dbinteractions"
import { AxiosResponse } from 'axios';
import { alertController } from '@ionic/core';
import { EventEmitter } from '@ionic/core/dist/types/stencil-public-runtime';

@Component({
    tag: "app-login",
    styleUrl: "app-login.css"
  })

export class AppLogin {

    private navCtrl: HTMLIonRouterElement

    //STATE
    @State() userFields: 
    {
        email: string
        password: string
    } = {email: "fernito@gmail.com", password: "123456"};
    @State() loadingUser: boolean = false

    //LIFECYCLE
    componentWillLoad() {
        console.log("component will load LOGIN")
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
    }

    //FUNCTIONS
    handleChange(e, field) {
        this.userFields = {
            ...this.userFields, 
            [field]: e.detail.value
        }
    }    

    async presentLoginAlert(msg: string) {
		const alert = await alertController.create({
		  header: 'Authentication error',		  
		  message: msg,
		  buttons: [{text: "Okay", handler: () => {}, role: 'cancel'}]
		});
	
		await alert.present();
	}

    handleSubmit = async e => {
        e.preventDefault()

        this.loadingUser = true
        
        const loginResult: AxiosResponse | undefined = await logIn({
            email: this.userFields.email, 
            password: this.userFields.password
        })

        this.loadingUser = false

        AppState.setAuth(loginResult!.data.auth)
        AppState.setActiveUser({
            name: loginResult!.data.user_name,
            id: loginResult!.data.user_id,
            email: this.userFields.email,
        })
        //console.log(`from login: ${AppState.activeUser().name}`)
        
        //IF ERROR, SHOW ALERT
        if (!AppState.auth()) 
            this.presentLoginAlert(loginResult!.data.msg) 

            
        //IF AUTHENTICATED, REDIRECT
        if (AppState.auth()) {
            this.navCtrl = document.querySelector("ion-router")
            this.navCtrl.push("/dashboard", "forward")
        }        

        
    }

    ////////
    //RENDER
    ////////
    render() {
        return [	
            this.loadingUser &&
            <app-loading></app-loading>
            ,		
            <ion-header>
                <ion-toolbar color="primary">
                    <ion-title class="ion-text-center" size="large">To-do</ion-title>
                </ion-toolbar>
            </ion-header>
            ,               
            <ion-content>
           
                <form onSubmit={this.handleSubmit} >
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-item>
                                    <ion-label position="floating">User email</ion-label>
                                    <ion-input 
                                        type="email"
                                        value={this.userFields["email"]}
                                        onIonChange={e => this.handleChange(e, "email")}
                                    ></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-item>
                                    <ion-label position="floating">Password</ion-label>
                                    <ion-input 
                                        type="password"
                                        value={this.userFields["password"]}
                                        onIonChange={e => this.handleChange(e, "password")}
                                    ></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col class="ion-text-center">
                                <ion-button 
                                    type="submit"
                                    disabled={this.userFields.password === "" || this.userFields.email === ""}
                                >
                                    Log in                                    
                                </ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>				
                </form>
            
            </ion-content>
        ]
    }
}

