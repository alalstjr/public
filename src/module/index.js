import { combineReducers } from 'redux';
import authentication from './auth';
import memo from './memo';
import search from './search';

export default combineReducers({
    authentication,
    memo,
    search
});