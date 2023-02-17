import {ADD_ARTICLE} from '../types';

export default function(state={},action){

    switch(action.type){
        case ADD_ARTICLE:
            return{
                ...state,
                article:action.payload
            }
        default:
            return state;
    }

}