import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})

export class AppRoot {
  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="app-login" />
          <ion-route url="/profile/:name" component="app-profile" />
          <ion-route url="/dashboard/:shouldload" component="app-dashboard" />
          <ion-route url="/project/:project_id" component="app-project" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
