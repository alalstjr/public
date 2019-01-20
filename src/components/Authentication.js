import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class Authentication extends React.Component {

    // state
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            password : ""
        };
        this.handleChange = this.handleChange.bind(this);
        
        // containers/auth/login 의 props 
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

        // 엔터키 작동
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;
        
        // Containers 의 props로 전달받은 onLogin 을 실행
        this.props.onLogin(id, pw).then(
            (success) => {
                //  success 는 아까전에 Login 컴포넌트의 handleLogin 에서 리턴한 true/false 값
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;
        
        this.props.onRegister(id, pw).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: ''
                    });
                }
            }
        );
    }

    handleKeyPress(e) {
        if(e.charCode==13) {
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {

        // common component
        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>Username</label>
                    <input
                        name="username"
                        type="text"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.username}
                    />
                </div>
                <div className="input-field col s12">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        className="validate"
                        onChange={this.handleChange}
                        value={this.state.password}
                        onKeyPress={this.handleKeyPress}
                    />
                </div>
            </div>
        );

        // 로그인
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {inputBoxes}
                        <a 
                            className="waves-effect waves-light btn" 
                            onClick={this.handleLogin}>
                            SUBMIT
                        </a>
                    </div>
                </div>


                <div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>

            </div>
        );

        // 회원가입
        const registerView = (
            <div className="card-content">
                <div className="row">
                    {inputBoxes}
                    <a className="waves-effect waves-light btn"
                        onClick={this.handleRegister}>CREATE</a>
                </div>
            </div>
        );

        // Containers 의 props로 전달받은 this.props.mode 값
        return (
            <div className="container auth">
                <Link className="logo" to="/">MEMOPAD</Link>
                <div className="card">
                    <div className="header blue white-text center">
                        <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    </div>
                    {this.props.mode ? loginView : registerView }
                </div>
            </div>
        );
    }
}

const propTypes = {
    mode: PropTypes.bool,
    onLogin: PropTypes.func,
    onRegister: PropTypes.func
};
const warning = (funcName) => {
    return () => console.warn(`${funcName} is not defined`);
}
const defaultProps = {
    mode : true,
    onLogin : warning('login'),
    onRegister : warning('register'),
};

Authentication.propTypes = propTypes;
Authentication.defaultProps = defaultProps;

export default Authentication;