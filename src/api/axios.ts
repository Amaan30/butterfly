import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
        baseURL: API_URL + "api",
        withCredentials: true,
        headers:{
                'Content-Type': 'application/json'
        }
})

export default instance;