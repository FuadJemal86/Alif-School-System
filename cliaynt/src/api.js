import axios , { CanceledError}from "axios";

const api = axios.create({
    baseURL: 'https://fuad.jmcpharma.com',
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers['token'] = token
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

export default api
export {CanceledError}