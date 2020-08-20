import axiosClient from "../config/axios"

export const logIn = async data => {
    try {
        const response = await axiosClient.post("/api/", data)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const callProjects = async user => {
    try {
        const response = await axiosClient.get(`/api/user/${user.id}`)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const callTasks = async (user, project_id) => {
    try {
        const response = await axiosClient.get(`/api/user/${user.id}?project_id=${project_id}`)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const callProjectsAndTasks = async (user) => {
    try {
        const responseProj = await axiosClient.get(`/api/user/${user.id}`)        
        
        const projects = responseProj.data

        for (let i = 0; i < projects.length; i++) {
            try {
                let responseTsk = await axiosClient.get(`/api/user/${user.id}?project_id=${projects[i].project_id}`)        
                projects[i].tasks = responseTsk.data
            } catch (error) {
                console.log(error)
            }  
        }
        
        return projects
        
    } catch (error) {
        console.log(error)
    }    
}

export const editAndSaveProject = async data => {
    try {
        const response = await axiosClient.put(`/api/update_project/${data._id}`, data)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const editAndSaveTask = async data => {
    try {
        const response = await axiosClient.put(`/api/update_task/${data._id}`, data)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const saveNewProject = async data => {
    try {
        const response = await axiosClient.post(`/api/add_project`, data)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const saveNewTask = async data => {
    try {
        const response = await axiosClient.post(`/api/add_task`, data)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const removeProject = async project_id => {    
    try {
        const response = await axiosClient.delete(`/api/delete_project/${project_id}`)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

export const removeTask = async task_id => {    
    try {
        const response = await axiosClient.delete(`/api/delete_task/${task_id}`)        
        return response
    } catch (error) {
        console.log(error)
    }    
}

