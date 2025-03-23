import axios from "axios";

const instance = axios.create({
        baseURL: 'https://butterfly-backend-cbpz.onrender.com/api',
        withCredentials: true,
        headers:{
                'Content-Type': 'application/json'
        }
})

export default instance;