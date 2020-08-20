import {AppStateType} from "../interfaces/AppState"

class AppService {
    public AppStateData: AppStateType

    setActiveUser(user: {
		name: string
		id: string
		email: string}) 
    {
        this.AppStateData = {...this.AppStateData, activeUser: user}
    }

    setAuth(auth: boolean) {
        this.AppStateData = {...this.AppStateData, auth: auth}
    }

    setActiveProject(project: {
		projectname: string 
		project_id: string
    }) {
        this.AppStateData = {...this.AppStateData, activeProject: project}
    }

    auth = () => (this.AppStateData.auth)
    activeUser = () => (this.AppStateData.activeUser)
    activeProject = () => (this.AppStateData.activeProject)    
}

const AppState = new AppService()

AppState.setAuth(false)
AppState.setActiveProject({projectname: "", project_id: ""})
AppState.setActiveUser({name: "", id: "", email: ""})

export default AppState

