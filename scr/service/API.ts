/* eslint-disable */
import axios from 'axios'

export const useAPI = () => {

  const baseURL = "http://10.0.2.2:3333";  
  //const baseURL = "https://tky-underwear-backend.vercel.app";    
  
  const get = (url: string) => {
    return axios.get(baseURL + url)
  }

  const post = (url: string, data: any) => {
    return axios.post(baseURL + url, data)
  }

  const put = (url: string, data: any) => {
      return axios.put(baseURL + url, data)    
  }

  const _delete = (url: string) => { 
      return axios.delete(baseURL + url)
  }

  return { get, post, put, _delete}

}