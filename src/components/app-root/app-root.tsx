import { Component, h } from '@stencil/core';
import { AuthService } from '../../services/authentication-service';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})


export class AppRoot {
  
  async componentWillLoad() {
    AuthService.onAuthStateChange(user => {
      if (!user || user.isAnonymous) {
        document.querySelector("ion-router").push('/');
      }
    });
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="page-login" />          
          <ion-route url="/dashboard" component="page-dashboard" />
          <ion-route url="/project/:project_id" component="page-project" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
