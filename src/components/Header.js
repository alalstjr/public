import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Search } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Header extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            search : false
        }
    }

    // 구현 : 검색 상태를 전환하는 toggleSearch 메소드 작성
    toggleSearch = () => {
        let setState = () => {
            this.setState({
                search : !this.state.search
            });
        }

        this.state.search ? setState() : setState();
    }

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
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>
                        <ul>
                            <li>
                                <a onClick={this.toggleSearch}>
                                    <i className="material-icons">search</i>
                                </a>
                            </li>
                        </ul>

                        <div className="right">
                            <ul>
                                { this.props.isLoggedIn ? logoutButton : loginButton }
                            </ul>
                        </div>
                    </div>
                </nav>
                <ReactCSSTransitionGroup 
                transitionName="search" 
                transitionEnterTimeout={300} 
                transitionLeaveTimeout={300}>
                    {this.state.search ? 
                        <Search 
                            onClose={this.toggleSearch}
                            usernames={this.props.usernames}
                            onSearch = {this.props.onSearch}
                            searchStatus = {this.props.searchStatus}
                        /> : undefined 
                    }
                </ReactCSSTransitionGroup>
            </div>
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