import { combineReducers } from 'redux';
import User from './user_reducer';
import Article from './article_reducer';
const rootReducer = combineReducers({
    User,
    Article
})

export default rootReducer;