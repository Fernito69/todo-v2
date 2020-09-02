import firebase from "firebase/app"
import "firebase/auth"

class AuthenticationService {
    public user: firebase.User
    public detachListener: Function

    authProviders = {
        google: new firebase.auth.GoogleAuthProvider(),
        facebook: new firebase.auth.FacebookAuthProvider()
      }

    constructor() {
        this.init()
    }

    init() {
        const firebaseConfig = {
            apiKey: "AIzaSyBHOqJdDBschm45zMWZ8EcyksdpeJDR7hU",
            authDomain: "todo-list-e0af6.firebaseapp.com",
            databaseURL: "https://todo-list-e0af6.firebaseio.com",
            projectId: "todo-list-e0af6",
            storageBucket: "todo-list-e0af6.appspot.com",
            messagingSenderId: "1073150658510",
            appId: "1:1073150658510:web:79578bd89bea4b1d620d9f",
            measurementId: "G-PHGLQ32RV4"
          };
        firebase.initializeApp(firebaseConfig);

        firebase.auth().onAuthStateChanged(user => {
            this.user = user
        })
    }

    async signInWithPopup(provider) {
        return firebase.auth().signInWithPopup(provider)        
    }

    async logout() {
        return firebase.auth().signOut();
      }

    getCurrentUser(){
        return this.user;
      }

    getAuthProviders() {
        return this.authProviders;
      }

    watchAuthState(handler: Function): void {
        this.detachListener = firebase.auth().onAuthStateChanged(user => {
            this.user = user
            handler(user)
        })
    }

    async loginAnon(): Promise<firebase.auth.UserCredential> {
        try {
            return await firebase.auth().signInAnonymously()
        } catch (err) {
            console.log(err)
        }
    }

    onAuthStateChange(fnct) {
        firebase.auth().onAuthStateChanged(fnct);
      }
}

export const AuthService = new AuthenticationService()
