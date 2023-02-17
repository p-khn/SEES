import {AsyncStorage} from 'react-native';

export const FIREBASEURL = `YOUR FIREBASE URL`;
export const APIKEY = `YOUR API KEY`;
export const SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
export const SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
export const REFRESH = `https://securetoken.googleapis.com/v1/token?key=${APIKEY}`;



export const setToken = (values,cb) => {
    const dateNow = new Date();
    const expiration = dateNow.getTime() + (3600 * 1000);

    AsyncStorage.multiSet([
        ['@sees@token',values.token],
        ['@sees@refreshToken',values.refToken],
        ['@sees@expToken',expiration.toString()],
        ['@sees@uid',values.uid]
    ]).then(response =>{
        cb();
    });
}

export const getToken = (cb)=>{
    AsyncStorage.multiGet([
        '@sees@token',
        '@sees@refreshToken',
        '@sees@expToken',
        '@sees@uid'
    ]).then(value =>{
        cb(value);
    });
}