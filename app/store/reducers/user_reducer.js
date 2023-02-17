import { SIGN_UP, SIGN_IN, AUTO_SIGN_IN, GET_USER_TEXTS } from '../types';

export default function (state = {}, action) {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                auth: {
                    uid: action.payload.localId || false,
                    token: action.payload.idToken || false,
                    refToken: action.payload.refreshToken || false
                }
            }
        case SIGN_UP:
            return {
                ...state,
                auth: {
                    uid: action.payload.localId || false,
                    token: action.payload.idToken || false,
                    refToken: action.payload.refreshToken || false
                }
            }
        case AUTO_SIGN_IN:
            return {
                ...state,
                auth: {
                    uid: action.payload.user_id || false,
                    token: action.payload.id_token || false,
                    refToken: action.payload.refresh_token || false
                }
            }
        case GET_USER_TEXTS:
            return {
                ...state,
                userTexts: action.payload

            }
        default:
            return state
    }
}