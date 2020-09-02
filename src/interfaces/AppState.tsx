export interface AppStateType {
    auth: boolean
    activeUser : {
      name: string
      id: string
      email: string
    }
    activeProject: {
      projectname: string 
      project_id: string
    }    
    userProjects: Array<{
      projectname: string
      project_id: string
      tasks: Array<{
          taskname: string
          task_id: string
          taskfinished: boolean
      }>
    }>
}