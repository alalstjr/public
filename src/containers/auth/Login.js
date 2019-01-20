// src/containers/Login.js
import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/auth';
import { withRouter } from 'react-router-dom';

import $ from 'jquery';
import Materialize from 'materialize-css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleLogin(id, pw) {
        // 맨 앞에 return
        // handleLogin 메소드를 실행한 실행자에서
        // handleLogin.then() 방식으로 또 다음 할 작업을 설정 할 수 있게 해줍
        return this.props.loginRequest(id, pw).then(
            // 뒤에 .then() 은, AJAX 요청이 끝난다음에 할 작업
            () => {
                if(this.props.status === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    // 로그인이 성공하면, 세션 데이터를 쿠키에 저장
                    // btoa는 JavaScript의 base64 인코딩 함수

                    Materialize.toast('Welcome, ' + id + '!', 2000);
                    // Material.toast 는 Materializecss 프레임워크의 알림 기능
                    this.props.history.push("/");
                    // withRouter 를 통하여 라우팅을 트리거 할 수 있습니다 
                    // Link 를 누른것과 똑같은 효과, 이를 사용하기 위해 상단에 import
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
                // 성공하면 true, 실패하면 false 를 반환하죠?
                // 이는 성공여부를 알리기 위함입니다 (로그인 실패시 비밀번호 인풋박스 초기화)
                // authentication 컴포넌트로 전달
            }
        );
    }
    
    render() {
        return (
            // src\components/Authentication.js 로 this.handleLogin 함수를 props로 전달
            <div>
                <Authentication mode={true}
                    onLogin={this.handleLogin}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => { 
            return dispatch(loginRequest(id,pw)); 
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Login)
);