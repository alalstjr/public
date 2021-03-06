import React from 'react';
import { Route, withRouter } from "react-router-dom";
import { Header } from 'components';
import { Home, Login, Register, Wall } from './';

import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'module/auth_api';
import { searchRequest } from 'module/search_api';

import $ from 'jquery';
import Materialize from 'materialize-css';

import style from '../style/style.css';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        // get loginData from cookie
        let loginData = getCookie('key');

        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined") return;

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;

        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                console.log(this.props.status);
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        username: ''
                    };

                    document.cookie='key=' + btoa(JSON.stringify(loginData));

                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);

                }
            }
        );
    }

    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                Materialize.toast('Good Bye!', 2000);

                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        );
    }

    handleSearch = (username) => {
        return this.props.searchRequest(username).then(
            () => {
                if( this.props.searchStatus !== 'SUCCESS') {
                    // console.log(JSON.stringify(this.props.searchUsers, null, 4) + '서치');

                    /*
                        ERROR CODES
                            1: INVALID ID,
                            2: EMPTY CONTENTS
                            3: NOT LOGGED IN
                            4: NO RESOURCE
                            5: PERMISSION FAILURE
                    */
                    let errorMessage = '검색에 오류가 있습니다.';
                    // NOTIFY ERROR
                    console.log(errorMessage);
                }

            }
        );
    }

    render() {

        /* Check whether current route is login or register using regex */
        let re = /(login|register)/;
        let isAuth = re.test(this.props.location.pathname);

        return (
            <div>
                {
                    isAuth ? undefined : 
                    <Header 
                        isLoggedIn={this.props.status.isLoggedIn}
                        onLogout={this.handleLogout}
                        onSearch = {this.handleSearch}
                        usernames = {this.props.searchUsers}
                        searchStatus = {this.props.searchStatus}
                    />
                }
                <Route exact path="/" component={Home} />
                <Route path="/home/" component={Home} />
                <Route path="/login/" component={Login} />
                <Route path="/register/" component={Register} />
                <Route path="/wall/:username" component={Wall}/>
            </div>
        );
        // usernames = {this.props.searchUsers} component 외부에서  this.props. 를 붙인다.
    }
}

const mapStateToProps = (state) => {
    // console.log(JSON.stringify(state.search.status, null, 4));   x
    // console.log(JSON.stringify(state.search.searchHead.status, null, 4));   O
    // state 의 search 파일의 search 속성의 status를 불러옴
    
    return {
        status : state.authentication.status,
        searchUsers : state.search.searchHead.usernames,
        searchStatus : state.search.searchHead.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        searchRequest : (username) => {
            return dispatch(searchRequest(username));
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(App)
);