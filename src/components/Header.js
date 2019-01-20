import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class Header extends React.Component {
    render() {
        
        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );
        
        return (
            <nav>
                <div className="nav-wrapper blue darken-1">
                    <Link to="/" className="brand-logo center">MEMOPAD</Link>

                    <ul>
                        <li><a><i className="material-icons">search</i></a></li>
                    </ul>

                    <div className="right">
                        <ul>
                            { this.props.isLoggedIn ? logoutButton : loginButton }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const propTypes = {
    isLoggedIn : PropTypes.bool, // 현재 로그인 상태인지 아닌지 알려주는 값
    onLogout : PropTypes.func // 함수형 props 로서 로그아웃을 담당
}

const warning = (funcName) => {
    return () => console.warn(`${funcName} is not defined`);
};
const defaultProps = {
    isLoggedIn : false,
    onLogout : warning('onLogout')
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;