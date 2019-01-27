import { createAction, handleActions } from 'redux-actions';
import update from 'react-addons-update';

/* ----- Memo Search */

const SEARCH = "search/SEARCH";
const SEARCH_SUCCESS = "search/SEARCH_SUCCESS";
const SEARCH_FAILURE = "search/SEARCH_FAILURE";

export const search = createAction(SEARCH);
export const search_success = createAction(SEARCH_SUCCESS);
export const search_failure = createAction(SEARCH_FAILURE);

const initialState = {
    searchHead : {
        status : 'INIT',
        usernames: []
    }
}

export default handleActions({
    [SEARCH] : (state) => {
        return update(state, {
            searchHead : {
                status : { $set : 'WAITING' },
                usernames : { $set : [] }
            }
        });
    },
    [SEARCH_SUCCESS] : (state, action) => {
        // console.log(action);
        return update(state, {
            searchHead : {
                status : { $set : 'SUCCESS' },
                usernames : { $set : action.username }
            }
        });
    },
    [SEARCH_FAILURE] : (state, action) => {
        return update(state, {
            searchHead : {
                status : { $set : 'FAILURE' },
                error : { $set : action.error }
            }    
        });
    }
}, initialState);