import { alertController } from '@ionic/core';

export function sayHello() {
  return Math.random() < 0.5 ? 'Hello' : 'Hola';
}

export function completionPercentage(project) {
  const total = project.length
  let finished = 0

  project.forEach(task => {
      if (task.taskfinished)
          finished++
  })

  const percentage = (finished/total*100).toFixed(0)
  return percentage
}

export async function presentSimpleAlert(head, msg) {
    const alert = await alertController.create({
        header: head,		  
        message: msg,
        buttons: [{text: "Okay", handler: () => {}, role: 'cancel'}]
    });

  await alert.present();
}