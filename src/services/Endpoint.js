import axios from 'axios'


export const BaseUrl= import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'https://localhost:7210/api'

const instance=axios.create({
    baseURL:BaseUrl,
    withCredentials: true
})

export const get=(url,params)=>instance.get(url,{params})
export const post=(url,data)=>instance.post(url,data)
export const patch=(url,data)=>instance.patch(url,data)
export const del=(url)=>instance.delete(url)