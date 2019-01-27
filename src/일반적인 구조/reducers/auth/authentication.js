import * as types from '../../actions/auth/ActionTypes';
import update from 'react-addons-update';
// immutable.js
// React state에서 내부배열을 처리할때는
// push는 직접적으로 배열을 건들기때문에 사용하면 안됨
// 해결방안 
// - concat으로 새로운 배열 만들고 대체 
// - facebook이 만든 Immutable Helper인 immutable.js사용

const initialState = {
    // 만약 액션이 없을경우 내보내는 기본값
    login: {
        status: 'INIT'
    },
    register : {
        status : 'INIT',
        error : -1
    },
    status: {
        valid: false,
        // valid 로그인 체크 하는 키값
        // 페이지가 새로고침 되었을 때, 세션이 유효한지 체크하고, 
        // 유효하다면 true, 만료되었거나 비정상적이면 false 로 설정합니다.
        isLoggedIn: false,
        currentUser: '',
    }
};

export default function authentication(state = initialState, action) {
    // if(typeof state === "undefined")
    //     state = initialState; // 기본값을 내보냄

    switch(action.type) {
        /* ----- Login */
        // container auth register 값을 로 전송
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING' }
                    // 로그인 중이라면 status 를 waiting 으로 변경 아래도 같음
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: 'SUCCESS' }
                },
                status: {
                    isLoggedIn: { $set: true },
                    currentUser: { $set: action.username }
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' }
                }
            });
        /* ----- Register */
        case types.AUTH_REGISTER : 
            return update(state, {
                register: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.AUTH_REGISTER_FAILURE :
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        /* ----- State View */
        case types.AUTH_GET_STATUS:
        // AUTH_GET_STATUS 는 쿠키에 세션이 저장 된 상태에서,
        // 새로고침을 했을 때 만 실행이 됩니다.
            return update(state, {
                status: {
                    isLoggedIn: { $set: true }
                    // 액션이 처음 실행 될 때, isLoggedIn 을 true 로 하는데요,
                    // 이 이유는, 이렇게 하지 않으면 로그인 된 상태에서 새로고침 했을 때,
                    // 세션 확인 AJAX 요청이 끝날떄까지 (아주 짧은시간이지만) 
                    // 컴포넌트가 현재 로그인상태가 아닌것으로 인식하기 때문에
                    // 미세한 시간이지만 살짝, 깜빡임이 있겠죠? (로그인 버튼에서 로그아웃 버튼으로 변하면서) 
                    // 이를 방지하기위하여 요청을 시작 할때는 컴포넌트에서 로그인상태인것으로 인식하게 하고
                    // 세션이 유효하다면 그대로 두고, 그렇지 않다면 로그아웃상태로 만듭니다.
                }
            });
        case types.AUTH_GET_STATUS_SUCCESS :
            return update(state, {
                status: {
                    valid: { $set: true },
                    currentUser: { $set: action.username }
                }
            });
        case types.AUTH_GET_STATUS_FAILURE :
            return update(state, {
                status: {
                    valid: { $set: false },
                    isLoggedIn: { $set: false }
                }
            });
        /* ----- Logout */
        case types.AUTH_LOGOUT :
            return update(state, {
                status : {
                    isLoggedIn: { $set: false },
                    currentUser: { $set: '' }
                }
            });
        default:
            return state;
    }
}