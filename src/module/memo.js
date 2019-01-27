import { createAction, handleActions } from 'redux-actions';
import update from 'react-addons-update';

/* ----- MEMO */
const MEMO_POST                 = "memo/MEMO_POST";
const MEMO_POST_SUCCESS         = "memo/MEMO_POST_SUCCESS";
const MEMO_POST_FAILURE         = "memo/MEMO_POST_FAILURE";

export const memo_post          = createAction(MEMO_POST);
export const memo_post_success  = createAction(MEMO_POST_SUCCESS);
export const memo_post_failure  = createAction(MEMO_POST_FAILURE);

/* ----- MEMOLIST */
const MEMO_LIST                 = "memo/MEMO_LIST";
const MEMO_LIST_SUCCESS         = "memo/MEMO_LIST_SUCCESS";
const MEMO_LIST_FAILURE         = "memo/MEMO_LIST_FAILURE";

export const memo_list          = createAction(MEMO_LIST);
export const memo_list_success  = createAction(MEMO_LIST_SUCCESS);
export const memo_list_failure  = createAction(MEMO_LIST_FAILURE);

/* ----- MEMOEDIT */
const MEMO_EDIT                 = "memo/MEMO_EDIT";
const MEMO_EDIT_SUCCESS         = "memo/MEMO_EDIT_SUCCESS";
const MEMO_EDIT_FAILURE         = "memo/MEMO_EDIT_FAILURE";

export const memo_edit          = createAction(MEMO_EDIT);
export const memo_edit_success  = createAction(MEMO_EDIT_SUCCESS);
export const memo_edit_failure  = createAction(MEMO_EDIT_FAILURE);

/* ----- MEMOREMOVE */
const MEMO_REMOVE               = "memo/MEMO_REMOVE";
const MEMO_REMOVE_SUCCESS       = "memo/MEMO_REMOVE_SUCCESS";
const MEMO_REMOVE_FAILURE       = "memo/MEMO_REMOVE_FAILURE";

export const memo_remove            = createAction(MEMO_REMOVE);
export const memo_remove_success    = createAction(MEMO_REMOVE_SUCCESS);
export const memo_remove_failure    = createAction(MEMO_REMOVE_FAILURE);

/* ----- MEMOSTAR */
const MEMO_STAR                 = "memo/MEMO_STAR";
const MEMO_STAR_SUCCESS         = "memo/MEMO_STAR_SUCCESS";
const MEMO_STAR_FAILURE         = "memo/MEMO_STAR_FAILURE";

export const memo_star          = createAction(MEMO_STAR);
export const memo_star_success  = createAction(MEMO_STAR_SUCCESS);
export const memo_star_failure  = createAction(MEMO_STAR_FAILURE);

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    },
    list: {
        status: 'INIT',
        data: [],
        isLast: false
    },
    edit: {
        status: 'INIT',
        error: -1
    },
    remove : {
        status : 'INIT',
        error : -1
    },
    star : {
        status : 'INIT',
        error : -1
    }
};

export default handleActions({
    /* ----- Memo Post */
    [MEMO_POST] : (state) => {
        return update(state, {
            post : {
                status : { $set : 'WAITING' },
                error: { $set: -1 }
            }
        });
    },
    [MEMO_POST_SUCCESS] : (state) => {
        return update(state, {
            post : {
                status : { $set : 'SUCCESS' }
            }
        });
    },
    [MEMO_POST_FAILURE] : (state, action) => {
        return update(state, {
            post : {
                status : { $set : 'FAILURE' },
                error: { $set: action.error }
            }
        });
    },
    /* ----- Memo List */
    [MEMO_LIST] : (state) => {
        return update(state, {
            list: {
                status: { $set: 'WAITING' },
            }
        });
    },
    [MEMO_LIST_SUCCESS] : (state,action) => {
        if(action.isInitial) {
            return update(state, {
                list: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                    isLast: { $set: action.data.length < 6 }
                    // isLast 값은 현재 로딩된 페이지가 마지막페이지인지 아닌지 알려줍니다.
                    // 한 페이지에 6개의 메모를 보여주는데요, 로드한 메모가 6개 미만이라면,
                    // 더 이상 메모가 없다는것을 의미합니다.
                }
            });
        } else {
            if(action.listType === 'new') {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $unshift: action.data },
                    }
                });
            } else {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $push: action.data },
                        isLast: { $set: action.data.length < 6 }
                    }
                });    
            }
        }
    },
    [MEMO_LIST_FAILURE] : (state) => {
        return update(state, {
            list: {
                status: { $set: 'FAILURE' }
            }
        });
    },
    /* ----- Memo Edit */
    [MEMO_EDIT] : (state) => {
        return update(state, {
            edit: {
                status: { $set: 'WAITING' },
                error: { $set: -1 },
                memo: { $set: undefined }
            }
        });
    },
    [MEMO_EDIT_SUCCESS] : (state, action) => {
        return update(state, {
            edit: {
                status: { $set: 'SUCCESS' }
            },
            list: {
                data: { 
                    [action.index]: { $set: action.memo }
                    //  list 의 데이터 중 [action.index] 번째 데이터를 새로운 데이터로 교체합니다.
                }
            }
        });
    },
    [MEMO_EDIT_FAILURE] : (state, action) => {
        return update(state, {
            edit: {
                status: { $set: 'FAILURE' },
                error: { $set: action.error }
            }
        });
    },
    /* ----- Memo Remove */
    [MEMO_REMOVE] : (state) => {
        console.log('리듀서');
        return update(state, {
            remove: {
                status: { $set : 'WAITING' }
            }
        });
    },
    [MEMO_REMOVE_SUCCESS] : (state,action) => {
        return update(state, {
            remove : {
                status : { $set : 'SUCCESS' }
            },
            list : {
                data: { $splice: [[action.index, 1]] }
            }
        });
    },
    [MEMO_REMOVE_FAILURE] : (state, action) => {
        return update(state, {
            remove: {
                status : { $set : 'FAILURE' },
                error : { $set : action.error }
            }
        });
    },
    [MEMO_STAR] : (state) => {
        return update(state, {
            star : {
                status : { $set : 'WAITING' },
                error: { $set: -1 }
            }
        });
    },
    [MEMO_STAR_SUCCESS] : (state, action) => {
        return update(state, {
            star : {
                status : { $set : 'SUCCESS' }
            },
            list: {
                data: {
                    [action.index]: { $set: action.memo }
                }
            }
        });
    },
    [MEMO_STAR_FAILURE] : (state, action) => {
        return update(state, {
            star : {
                status : { $set : 'FAILURE' },
                error : { $set : action.error }
            }
        });
    },
},initialState)