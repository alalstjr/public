import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

class Search extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            keyword : ''
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        // input 박스에서 enter 키가 눌려지면 맨 위에있는 유저네임의 ‘담벼락’ 으로 이동

        // ESC 키를 누르십시오. 눌렀을 때 닫습니다.
        const listenEscKey = (evt) => {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                this.handleClose();
            }
        };
        // 인풋박스 뿐만아니라, 페이지 전체에서 ESC 키를 누르면 종료되도록 설정하였습니다.
        document.onkeydown = listenEscKey;
    }

    handleClose() {
        this.handleSearch('');
        document.onkeydown = null;
        // 종료될때는, document.onkeydown 을 null로 지정하여 리스너를 해제합니다.
        this.props.onClose();
    }

    handleChange(e) {
        this.setState({
            keyword: e.target.value
        });
        this.handleSearch(e.target.value);
    }

    handleSearch(keyword) {
        // TO BE IMPLEMENTED
        this.props.onSearch(keyword);
    }

    handleKeyDown = (e) => {
        // PRESSED ENTER를 누르면 트리거가 첫 번째 사용자에게 네비게이션 할 수 있습니다.
        if(e.keyCode === 13) {
            if(this.props.usernames.length > 0) {
                this.handleClose();
                this.props.history.push('/wall/' + this.props.usernames[0].username);
            }
        }
    }

    render() {

    const mapDataToLinks = (data) => {
        // IMPLEMENT: map data array to array of Link components
        // create Links to '/wall/:username'
        
        return data.map((user, i) => {
            // console.log(user);
            // console.log(users.username+'유저');
            // console.log(i+'index');
            return(
                <Link to={`/wall/${user.username}`} key={i}>{user.username}</Link>
            );
        });
    };

    return (
        <div className="search-screen white-text">
            <div className="right">
                <a 
                    className="waves-effect waves-light btn red lighten-1"
                    onClick={this.handleClose}
                >
                    CLOSE
                </a>
            </div>
            <div className="container">
                <input placeholder="Search a user"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
                <ul className="search-results">
                    { mapDataToLinks(this.props.usernames) }
                </ul>
            </div>
        </div>
    );
  }
}

const propTypes = {
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    usernames: PropTypes.array
};
    
const warning = (funcName) => {
    return () => console.warn(`${funcName} is not defined`);
    }
const defaultProps = {
    onClose : warning('onClose'),
    onSearch : warning('onSearch'),
    usernames: []
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default withRouter(Search);