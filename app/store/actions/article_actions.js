import axios from 'axios';
import {FIREBASEURL} from '../../utils/urls';
import{ ADD_ARTICLE } from '../types'


export function addArticle(data,token){
const request = axios({
    method:'POST',
    url:`${FIREBASEURL}/articles.json?auth=${token}`,
    data
}).then(response =>{
    return response.data
}).catch((err) =>{
    console.log(err)
})

return {
    type:ADD_ARTICLE,
    payload:request
}
}
