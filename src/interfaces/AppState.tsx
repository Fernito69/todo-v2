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
}