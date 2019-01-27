import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Search } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// SVG
import SVG from 'components/svg/SVG';

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
                    <SVG name="login" width="2rem" height="4rem" color="#ffffff" />
                    <div className="t-h">login</div>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <SVG name="logout" width="2rem" height="4rem" color="#ffffff" />
                    <div className="t-h">logout</div>
                </a>
            </li>
        );
        
        return (
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>
                        <ul className="line">
                            <li>
                                <a onClick={this.toggleSearch}>
                                    <SVG name="search" width="2rem" height="4rem" color="#ffffff" />
                                    <div className="t-h">search</div>
                                </a>
                            </li>
                        </ul>

                        <div className="right">
                            <ul className="line">
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