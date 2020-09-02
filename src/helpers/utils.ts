import { alertController } from '@ionic/core';
import { databaseService } from '../services/database-service';
import { Project } from '../services/model';
import {Task} from "../services/model"
import {set} from "../services/storage"

export function completionPercentage(project) {
  const total = project.length
  let finished = 0

  project.forEach(task => {
      if (task.taskfinished)
          finished++
  })

  const percentage = (finished/total*100).toFixed(0)  
  return +percentage
}

export async function presentSimpleAlert(head, msg) {
    const alert = await alertController.create({
        header: head,		  
        message: msg,
        buttons: [{text: "Okay", handler: () => {}, role: 'cancel'}]
    });

  await alert.present();
}

export async function avgCompletion(projects: Project[]) {
  
  let totalTasks: number = 0
  let completedTasks: number = 0  
  let finalNumber: number = 0
  let currentProject: number = 0
  
    
  projects.forEach(async project => {

    let projectTasks: Task[]    

    await databaseService.watchTasks(project.project_id, tasks => {
      projectTasks = tasks.reverse()
      
      let currentTask: number = 0
      currentProject++      
      
      projectTasks.forEach(task => {
        totalTasks++
        currentTask++
        task.taskfinished && completedTasks++  
        finalNumber = +(completedTasks/totalTasks*100).toFixed(1)
        
        //console.log(`${currentProject} == ${projects.length} && ${currentTask} == ${projectTasks.length}`)
        
        if (currentProject == projects.length && currentTask == projectTasks.length) {
          //console.log(finalNumber)
          set("globalCompletion",{finalNumber, totalTasks, completedTasks})
        }          
      })
    })
  })  
}