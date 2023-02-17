import axios from 'axios';
import {SIGN_UP, SIGN_IN, AUTO_SIGN_IN, GET_USER_TEXTS} from '../types';

import {FIREBASEURL, SIGNUP, SIGNIN, REFRESH} from '../../utils/urls';

export function signUp(data){
    const request = axios({
        method:'POST',
        url:SIGNUP,
        data:{
            email:data.email,
            password:data.password,
            returnSecureToken:true
        },
        header:{
            "Content-Type":"application/json"
        }
    }).then(response =>{
        return response.data
    }).catch(err =>{
        return false 
    });

    return {
        type:SIGN_UP,
        payload:request
    }
}

export function signIn(data){
    const request = axios({
        method:'POST',
        url:SIGNIN,
        data:{
            email:data.email,
            password:data.password,
            returnSecureToken:true
        },
        header:{
            "Content-Type":"application/json"
        }
    }).then(response =>{
        return response.data
    }).catch(err =>{
        return false 
    });
    return {
        type:SIGN_IN,
        payload:request
    }
}

export const autoSignIn = (refToken) =>{

    const request = axios({
        method:'POST',
        url:REFRESH,
        data:`grant_type=refresh_token&refresh_token=${refToken}`,
        header:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(response =>{
        return response.data
    }).catch(err =>{
        return false
    });

    return{
        type:AUTO_SIGN_IN,
        payload:request
    }
}

export function getUserTexts(UID){

    const request = axios(`${FIREBASEURL}/articles.json?orderBy=\"uid\"&equalTo=\"${UID}\"`)
    .then( response => {
        let articles = [];

        for(let key in response.data){
            articles.push({
                ...response.data[key],
                id: key 
            })
        }
        return articles;
    }).catch((err) =>{
        return false
    });

    return{
        type: GET_USER_TEXTS,
        payload: request
    }
}