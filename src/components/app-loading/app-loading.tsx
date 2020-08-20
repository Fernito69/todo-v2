import { Component, h } from '@stencil/core';

@Component({
    tag: "app-loading",
    styleUrl: "app-loading.css"
  })

export class AppLoading {

    render() {
        return [
            <div class="backdrop">
                <div class="spinner-container2">
                    <ion-spinner color="dark" class="loading-spinner"></ion-spinner>
                </div>
            </div> 
        ]
    }
 
}