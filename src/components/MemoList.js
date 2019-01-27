import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Memo } from 'components';

/* action css */
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import memoAction from 'style/memo-action.css';

export default class MemoList extends Component {
    
    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
        // 위와 같이, 전달받은 props 값이 달라질때만 render() 메소드를
        // 실행하도록 설정하면 위 문제들이 완화됩니다.
    }

    render() {
        console.log('MemoList render method executed');

        // Home 컴포넌트 받은 데이터 배열을 컴포넌트 매핑
        const mapToComponents = data => {
            return data.map((memo, i) => {
                return (
                    <Memo 
                        data={memo}
                        ownership={ (memo.writer === this.props.currentUser) }
                        key={memo._id}
                        index={i}   // 해당 메모가 몇번째 메모인지 알려줍니다.
                        onEdit={this.props.onEdit}
                        onRemove={this.props.onRemove}
                        onStar={this.props.onStar}
                        currentUser={this.props.currentUser}  
                        // currentUser props 도 전달되었습니다 (유저가 각 메모를 star 한지 안한지 여부를 확인하는데 사용됩니다)
                    />
                );
            });
        };

        // 주의 { maptoComponents.this.props.data) } 를 다른 엘리먼트로 감싸면
        // 애니메이션이 작동하지 않습니다
        return (
            <div>
            <ReactCSSTransitionGroup 
                transitionName="memo" 
                transitionEnterTimeout={2000}
                transitionLeaveTimeout={1000}
            >
                {mapToComponents(this.props.data)}
            </ReactCSSTransitionGroup>
            </div>
        )
    }
}

const propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onStar: PropTypes.func,
};

const warning = (funcName) => {
    return () => console.warn(`funcName is not defined`);
}
const defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => { 
        console.error('edit function not defined');     
    },
    onRemove: (id, index) => { 
        console.error('onRemove function not defined');     
    },
    onStar: (id, index) => { 
        console.error('onStar function not defined');     
    }
};

MemoList.propTypes = propTypes;
MemoList.defaultProps = defaultProps;