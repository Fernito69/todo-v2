import axios from "axios"

const axiosClient = axios.create({
    //baseURL: "http://127.0.0.1:8000/"
    baseURL: "https://to-do-list-nico.herokuapp.com/"
})

export default axiosClient