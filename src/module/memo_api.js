import * as types from './memo';
import axios from 'axios';

/*============================================================================
    memo
==============================================================================*/

/* ----- Memo */
export function memoPostRequest(contents) {
    return (dispatch) => {
        // inform MEMO POST API is starting
        dispatch(memoPost());

        return axios.post('/api/memo/', { contents })
        .then((response) => {
            dispatch(memoPostSuccess());
        }).catch((error) => {
            dispatch(memoPostFailure(error.response.data.code));
        });
    }
}
export function memoPost() {
    return {
        type: types.memo_post
    }
}

export function memoPostSuccess() {
    return {
        type: types.memo_post_success
    }
}

export function memoPostFailure(error) {
    return {
        type: types.memo_post_failure,
        error
    }
}

/* ----- Memo List */
export function memoListRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        // inform memo list API is starting
        dispatch(memoList());
        
        let url = '/api/memo';
        
        if(typeof username==="undefined") {
            // username not given, load public memo
            url = isInitial ? url : `${url}/${listType}/${id}`;
            // or url + '/' + listType + '/' +  id
        } else {
            // load memos of specific user
            url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
        }
          
        return axios.get(url)
        .then((response) => {
            dispatch(memoListSuccess(response.data, isInitial, listType));
        }).catch((error) => {
            dispatch(memoListFailure());
        });
    }
}

export function memoList() {
    return {
        type: types.memo_list
    }
}

export function memoListSuccess(data, isInitial, listType) {
    return {
        type: types.memo_list_success,
        data,
        isInitial,
        listType
    }
}

export function memoListFailure() {
    return {
        type: types.memo_list_failure
    }
}

/* ----- Memo Edit */
export function memoEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(memoEdit());
        
        return axios.put('/api/memo/' + id, {contents})
        .then((response) => {
            dispatch(memoEditSuccess(index, response.data.memo));
        }).catch((error) => {
            dispatch(memoEditFailure(error.response.data.code));
        });
    }
}

export function memoEdit() {
    return {
        type : types.memo_edit
    }
}

export function memoEditSuccess(index, memo) {
    return {
        type : types.memo_edit_success,
        index,
        memo
    }
}

export function memoEditFailure(error) {
    return {
        type : types.memo_edit_failure,
        error
    }
}

/* ----- Memo Remove */

export function memoRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(memoRemove());
        console.log('보냄');
        return axios.delete('/api/memo/' + id)
        .then((response) => {
            console.log('성공');
            dispatch(memoRemoveSuccess(index));
        }).catch((error) => {
            dispatch(memoRemoveFailure(error.response.data.code));
        });
    }
}

export function memoRemove() {
    return {
        type : types.memo_remove
    };    
}

export function memoRemoveSuccess(index) {
    return {
        type : types.memo_remove_success,
        index
    }      
}

export function memoRemoveFailure(error) {
    return {
        type : types.memo_remove_failure,
        error
    }  
}

/* ----- Memo Star */
export function memoStarRequest(id, index) {
    return (dispatch) => {
        dispatch(memoStar());

        return axios.post('/api/memo/star/' + id)
        .then((response) => {
            dispatch(memoStarSuccess(index, response.data.memo))
        }).catch((error) => {
            dispatch(memoStarFailure(error.response.data.code));
        });
    }
}

export function memoStar() {
    return {
        type : types.memo_star
    }
}

export function memoStarSuccess(index, memo) {
    return {
        type : types.memo_star_success,
        index,
        memo
    }
}

export function memoStarFailure(error) {
    return {
        type : types.memo_star_failure,
        error
    }
}