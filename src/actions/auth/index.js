import * as types from './ActionTypes';
import axios from 'axios';

/*============================================================================
    authentication
==============================================================================*/

/* ----- Login */
export function loginRequest(username, password) {
    // 이런식으로 thunk 내부에서 다른 action 을 dispatch 할 수 있어요.
    // dispatch 는 보내다 라는 뜻으로 무언가 전송할때 사용
    return (dispatch) => {
        // Inform Login API is starting
        // dispatch보내기 함수로 login 액션을 보냅니다.
        dispatch(login());

        // 우선 reduser 로 액션이보내집니다.
        // reduser 에서 액션 변경이 감지되어 변경된 값을 다시 여기로 받습니다.

        // API REQUEST
        return axios.post('/api/account/signin', { username, password })
        .then((response) => {
            // SUCCEED
            dispatch(loginSuccess(username));
        }).catch((error) => {
            // FAILED
            dispatch(loginFailure());
        });
    };
}
export function login() {
    return {
        type: types.AUTH_LOGIN
    };
}

export function loginSuccess(username) {
    return {
        type: types.AUTH_LOGIN_SUCCESS,
        username
    };
}

export function loginFailure() {
    return {
        type: types.AUTH_LOGIN_FAILURE
    };
}

/* ----- Register */

export function registerRequest(username, password) {
    return(dispatch) => {
        // Inform Register API is starting
        dispatch(register());

        return axios.post('/api/account/signup', { username, password })
        .then((response) => {
            dispatch(registerSuccess());
        }).catch((error) => {
            dispatch(registerFailure(error.response.data.code));
        });
    }
}

export function register() {
    return {
        type : types.AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type : types.AUTH_REGISTER_SUCCESS,
    }
}

export function registerFailure(error) {
    return {
        type : types.AUTH_REGISTER_FAILURE,
        error
    }
}

/* ----- GET STATUS */
export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());

        return axios.get('/api/account/getInfo')
        .then((response) => {
            dispatch(getStatusSuccess(response.data.info.username));
        }).catch((error) => {
            dispatch(getStatusFailure());
        });
    };
}

export function getStatus() {
    return {
        type: types.AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: types.AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: types.AUTH_GET_STATUS_FAILURE
    };
}

/* ----- Logout */

export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
        .then((response) => {
            dispatch(logout());
        });
    };
}

export function logout() {
    return {
        type : types.AUTH_LOGOUT
    }
}
