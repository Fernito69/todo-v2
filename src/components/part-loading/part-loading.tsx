import { Component, h } from '@stencil/core';

@Component({
    tag: "part-loading",
    styleUrl: "part-loading.css"
  })

export class PartLoading {

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