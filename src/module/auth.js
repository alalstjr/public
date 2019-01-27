import { createAction, handleActions } from 'redux-actions';
import update from 'react-addons-update';

/* ----- AUTHENTICATION */

// 액션 타입을 정의해줍니다.
// Login
const AUTH_LOGIN = "auth/AUTH_LOGIN";
const AUTH_LOGIN_SUCCESS = "auth/AUTH_LOGIN_SUCCESS";
const AUTH_LOGIN_FAILURE = "auth/AUTH_LOGIN_FAILURE";
// Register
const AUTH_REGISTER = "auth/AUTH_REGISTER";
const AUTH_REGISTER_SUCCESS = "auth/AUTH_REGISTER_SUCCESS";
const AUTH_REGISTER_FAILURE = "auth/AUTH_REGISTER_FAILURE";

// State View 상태표시
const AUTH_GET_STATUS = "auth/AUTH_GET_STATUS";
const AUTH_GET_STATUS_SUCCESS = "auth/AUTH_GET_STATUS_SUCCESS";
const AUTH_GET_STATUS_FAILURE = "auth/AUTH_GET_STATUS_FAILURE";

// Logout
const AUTH_LOGOUT = "auth/AUTH_LOGOUT";

// 액션 생성 함수를 만듭니다.
export const auth_login = createAction(AUTH_LOGIN);
export const auth_login_success = createAction(AUTH_LOGIN_SUCCESS);
export const auth_login_failure = createAction(AUTH_LOGIN_FAILURE);

export const auth_register = createAction(AUTH_REGISTER);
export const auth_register_success = createAction(AUTH_REGISTER_SUCCESS);
export const auth_register_failure = createAction(AUTH_REGISTER_FAILURE);

export const auth_get_status = createAction(AUTH_GET_STATUS);
export const auth_get_status_success = createAction(AUTH_GET_STATUS_SUCCESS);
export const auth_get_status_failure = createAction(AUTH_GET_STATUS_FAILURE);

export const auth_logout = createAction(AUTH_LOGOUT);

// 모듈의 초기 상태를 정의합니다.
const initialState = {
    login: {
        status: 'INIT'
    },
    register : {
        status : 'INIT',
        error : -1
    },
    status: {
        valid: false,
        isLoggedIn: false,
        currentUser: '',
    }
};

export default handleActions({
    /* ----- Login */
    [AUTH_LOGIN] : (state) => {
        return update(state, {
            login: {
                status: { $set: 'WAITING' }
                // 로그인 중이라면 status 를 waiting 으로 변경 아래도 같음
            }
        });
    },
    [AUTH_LOGIN_SUCCESS] : (state, action) => {
        return update(state, {
            login: {
                status: { $set: 'SUCCESS' }
            },
            status: {
                isLoggedIn: { $set: true },
                currentUser: { $set: action.username }
            }
        });
    },
    [AUTH_LOGIN_FAILURE] : (state) => {
        return update(state, {
            login: {
                status: { $set: 'FAILURE' }
            }
        });    
    },
    /* ----- Register */
    [AUTH_REGISTER] : (state) => {
        return update(state, {
            register: {
                status: { $set: 'WAITING' },
                error: { $set: -1 }
            }
        });
    },
    [AUTH_REGISTER_SUCCESS] : (state) => {
        return update(state, {
            register: {
                status: { $set: 'SUCCESS' }
            }
        });
    },
    [AUTH_REGISTER_FAILURE] : (state, action) => {
        return update(state, {
            register: {
                status: { $set: 'FAILURE' },
                error: { $set: action.error }
            }
        });
    },
    /* ----- State View */
    [AUTH_GET_STATUS] : (state) => {
        return update(state, {
            status: {
                isLoggedIn: { $set: true }
            }
        });
    },
    [AUTH_GET_STATUS_SUCCESS] : (state, action) => {
        return update(state, {
            status: {
                valid: { $set: true },
                currentUser: { $set: action.username }
            }
        });
    },
    [AUTH_GET_STATUS_FAILURE] : (state) => {
        return update(state, {
            status: {
                valid: { $set: false },
                isLoggedIn: { $set: false }
            }
        });
    },
    /* ----- Logout */
    [AUTH_LOGOUT] : (state) => {
        return update(state, {
            status : {
                isLoggedIn: { $set: false },
                currentUser: { $set: '' }
            }
        });
    }
  }, initialState);