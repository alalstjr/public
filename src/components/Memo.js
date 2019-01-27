import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { Link } from "react-router-dom";

// SVG
import SVG from 'components/svg/SVG';

export default class Memo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editMode : false,
            editText : props.data.contents
        };

        this.activeBtn      = this.activeBtn.bind(this);
        this.toggleEdit     = this.toggleEdit.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handleRemove   = this.handleRemove.bind(this);
        this.handleStar     = this.handleStar.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let current = {
            props: this.props,
            state: this.state
        };
        
        let next = {
            props: nextProps,
            state: nextState
        };
        
        let update = JSON.stringify(current) !== JSON.stringify(next);
        return update;
    }

    componentDidUpdate() {
        // 컴포넌트가 리렌더링을 마친 후 실행됩니다.
        // window.addEventListener('load',function(){
        //     document.getElementById('dropdown-'+this.props.data._id).style.opacity = 1;
        //     document.getElementById('dropdown-'+this.props.data._id).style.display = 'block';
        // });
    }

    componentDidMount() {
        // 컴포넌트가 만들어지고 첫 렌더링을 다 마친 후 실행되는 메소드입니다.
        // 이 안에서 다른 JavaScript 프레임워크를 연동하거나,
        // setTimeout, setInterval 및 AJAX 처리 등을 넣습니다.
        // window.addEventListener('load',function(){
        //     document.getElementById('dropdown-'+this.props.data._id).style.opacity = 1;
        //     document.getElementById('dropdown-'+this.props.data._id).style.display = 'block';
        // });
    }

    activeBtn() {
        let btnBox = document.getElementById('dropdown-'+this.props.data._id);
        
        if(btnBox.style.display !== 'block') {
            btnBox.style.opacity = 1;
            btnBox.style.display = 'block';
        } else {
            btnBox.style.opacity = 0;
            btnBox.style.display = 'none';
        }
    }

    toggleEdit() {
        if(this.state.editMode) {
            let id = this.props.data._id;
            let index = this.props.index;
            let contents = this.state.editText;
            
            this.props.onEdit(id, index, contents).then(() => {
                this.setState({
                    editMode: !this.state.editMode
                });
            })
        } else {
            this.setState({
                editMode: !this.state.editMode
            });   
        }
    }

    handleChange(e) {
        this.setState({
            editText : e.target.value
        });
    }

    handleRemove() {
        let id = this.props.data._id;
        let index = this.props.index;
        this.props.onRemove(id, index);
    }

    handleStar() {
        let id = this.props.data._id;
        let index = this.props.index;
        this.props.onStar(id, index); 
    }

  render() {
    // console.log(this.props.data);

    const { data, ownership } = this.props;

    // EDITED info
    let editedInfo = (
        <span style={{color: '#AAB5BC'}}> · Edited <TimeAgo date={this.props.data.date.edited} live={true}/></span>
    );

    const dropDownMenu = (
        <div className="option-button">
            <a 
                className='dropdown-button'
                id={`dropdown-button-${data._id}`}
                data-activates={`dropdown-${data._id}`}
                onClick={this.activeBtn}
            >
                <i className="material-icons icon-button">more_vert</i>
            </a>
            <ul id={`dropdown-${data._id}`} className='dropdown-content'>
                <li>
                    <a onClick={this.toggleEdit}>Edit</a>
                </li>
                <li>
                    <a onClick={this.handleRemove}>Remove</a>
                </li>
            </ul>
        </div>
    );

    const editView = (
        <div className="write">
            <div className="card">
                <div className="card-content">
                    <textarea
                        className = "materialize-textarea"
                        onChange = {this.handleChange}
                        value = {this.state.editText}
                    ></textarea>
                </div>
                <div className="card-action">
                    <a onClick={this.toggleEdit}>OK</a>
                </div>
            </div>
        </div> 
    );

    // 별표가있는 경우 (NICKNAME이 (가) ARRAY에 있는지 여부를 확인)
    // 노란 색조를 가진 옷차림을 되찾아주세요.
    // 해당 메모가 유저가 star을 한지 안한지 확인하려면, 배열의 indexOf 메소드를 통하여 
    // starred 데이터에 로그인유저의 username이 적혀있는지 확인하면됩니다.
    let starStyle = (this.props.data.starred.indexOf(this.props.currentUser) > -1) ? { color: '#ff9980' } : { color: '#e9e9e9' } ;
    
    const memoView = (
        // 나중에 Edit 모드일때는 Write 와 비슷한 뷰를
        // 보여주게 할 것이기 때문에 미리 작업을 한것입니다.
        <div className="card">
            <div className="info">
                <Link 
                    to={`/wall/${this.props.data.writer}`} 
                    className="username">{this.props.data.writer}
                </Link> 
                wrote a log · <TimeAgo date={this.props.data.date.created}/> 
                { this.props.data.is_edited ? editedInfo : undefined }
                { this.props.ownership ? dropDownMenu : undefined }
            </div>
            <div className="card-content">
                {data.contents}
            </div>
            <div className="footer">
                <a className="log-footer-icon icon-button star" 
                    onClick={this.handleStar}
                    href="#none"
                >
                    <SVG name="star" width="1.5rem" height="1.5rem" color={starStyle.color} />
                    <div className="t-h">star</div>
                </a>

                <span className="star-count">{this.props.data.starred.length}</span>
            </div>
        </div>
    );

    return (
        <div className="container memo">
            { this.state.editMode ? editView : memoView }
        </div>
    );
  }
}

const propTypes = {
    data: PropTypes.object,
    ownership: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    index: PropTypes.number,
    onStar: PropTypes.func,
    currentUser: PropTypes.string
};

const warning = (funcName) => {
    return () => console.warn(`funcName is not defined`);
}
const defaultProps = {
    data: {
        _id: 'id1234567890',
        writer: 'Writer',
        contents: 'Contents',
        is_edited: false,
        date: {
            edited: new Date(),
            created: new Date()
        },
        starred: []
    },
    ownership: true,
    // ownership prop  은 해당 메모가 자신의 메모인지 
    // 아닌지 여부를 확인하는 값입니다.
    onEdit: (id, index, contents) => {
        console.error('onEdit function not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove function not defined');
    },
    index: -1,
    currentUser: ''
};

Memo.propTypes = propTypes;
Memo.defaultProps = defaultProps;