// src/containers/Home.js
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { Write, MemoList } from 'components';
import { 
    memoPostRequest,
    memoListRequest,
    memoEditRequest,
    memoRemoveRequest,
    memoStarRequest
} from 'module/memo_api';

import es6promise from 'es6-promise';
es6promise.polyfill();

class Home extends React.Component {
    
    constructor(props) {
        super(props);

        this.handlePost           = this.handlePost.bind(this);

        this.loadNewMemo          = this.loadNewMemo.bind(this);
        this.loadOldMemo          = this.loadOldMemo.bind(this); 
        this.componentWillUnmount = this.componentWillUnmount.bind(this); 
        this.componentDidMount    = this.componentDidMount.bind(this); 
        this.scrollEvent          = this.scrollEvent.bind(this);
        this.handleEdit           = this.handleEdit.bind(this);
        this.handleRemove         = this.handleRemove.bind(this);
        this.handleStar           = this.handleStar.bind(this);

        this.state = {
            loadingState: false,
            // 스크롤이 아래 조건문 구간에 들어갔을때 
            // 처음에만 한번 코드를 실행하게 해야하는데
            // loadingState state 를 활용하여 해결
            initiallyLoaded: false
            // initiallyLoaded 라는 값을 만들어서, 이 값이 true 일때만
            // 해당 메시지를 보여주도록 설정을 합시다.
        };
    }
    
    handlePost(contents) {
        return this.props.memoPostRequest(contents).then(
            () => {
                if(this.props.postStatus.status === "SUCCESS") { 
                // mapStateToProps 로 리듀서 연결한 값을 가져온것을
                // memo.post 의 status 값을 가져옵니다.
                this.loadNewMemo().then(
                    // 글이 작성되면 loadNewMemo 함수로 api 호출 리스트 불러옴
                    () => {
                        console.log('글을 작성하였습니다.');
                    }
                );
                } else {
                    switch(this.props.postStatus.error) {
                        case 1:
                            console.log('로그인을 해주세요!');
                            break;
                        case 2:
                            console.log('무언가 작성해주세요!');
                            break;
                        default:
                            console.log('오류가 있습니다.\n다시 작성해주세요');
                            break;
                    }
                }
            }
        );
    }
    
    scrollEvent() {
        let documentH = document.documentElement.scrollHeight;
        let windowH = window.innerHeight;
        let windowScroll = window.scrollY;
        let total = documentH - windowH - windowScroll;
        // console.log(`
        //     documentH : ${documentH}
        //     windowH : ${windowH}
        //     windowScroll : ${windowScroll}
        //     all : ${total}
        // `)
        if( total < 150 ) {
            if(!this.state.loadingState){
                console.log("LOAD NOW");
                this.loadOldMemo();
                this.setState({
                    loadingState : false
                });
            } else {
                if(this.state.loadingState){
                    this.setState({
                        loadingState: false
                    });
                }
            }
        }
    }

    componentDidMount() {
        // LOAD NEW MEMO EVERY 5 SECONDS
        const loadMemoLoop = () => {
            this.loadNewMemo().then(
                () => {
                    this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
                    // timeout 기능을 통하여 이 작업을 5초마다 반복하도록 설정하였습니다.
                }
            );
        };

        window.addEventListener('scroll', this.scrollEvent, true);
        // 다른 메서드 에서 외부 메서드를 사용할 경우 scrollEvent 이것을
        // 무조건 사용하는것 안하는것 bind(this) 해줘야만 this로 무엇인지 가르키고 찾아 연결합니다.

        const loadUntilScrollable = () => {
            // 화면 해상도에서 스크롤이 안생길경우
            let documentH = document.documentElement.offsetHeight;  // 지금화면의 document높이
            let windowH = window.innerHeight;   // 자신이보는 화면의 높이
            // IF THE SCROLLBAR DOES NOT EXIST,
            if(documentH < windowH) {
                this.loadOldMemo().then(
                    () => {
                        // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
                        if(!this.props.isLast) {
                            loadUntilScrollable();
                            // 마지막 리스트까지 반복
                        }
                    }
                );
            }
        };
        
        this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
            () => {
                // BEGIN NEW MEMO LOADING LOOP
                setTimeout(loadUntilScrollable, 1000);
                // componentDidMount 부분에 loadUntilScrollable 메소드를, 
                // 메모 초기 로딩 후, 1초뒤 실행하도록 하였습니다.
                // (나중에 담벼락의 유저가 변경되면서, 메모가 사라질 때도
                // 애니메이션이 적용됩니다. 애니메이션이 1초 걸리기때문에,
                // 1초뒤에 스크롤바가 있는지 없는지 확인하고 추가로딩 여부를 정합니다.
                // 이 부분을 미리 해결해놓지 않으면, 나중에 메모를 처음 로딩 하는 부분에서,
                // 최종적으론 스크롤바가 없어도, 스크롤바가 있는것으로 인식 할 수도 있습니다)

                loadMemoLoop();

                this.setState({
                    initiallyLoaded: true
                });                
            }
        );   
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.username !== prevProps.username) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
        // 여기까지하면, /wall/:username 으로 직접 링크를 쳐서 들어갔을때, 초기 로딩은 잘 됩니다.
        // 그러나, 그 상태에서 나중에 다른사람을 검색해서 또 들어갔을때
        // (Link 컴포넌트를 통하여 라우팅 했을 경우), 
        // 컴포넌트가 unmount 되고 다시 mount 되는게 아니라, update 되기 때문에,
        // 저희가 원하는대로 작동하지 않습니다. 따라서, componentDidUpdate LifeCycle API 를 통하여
        // username 이 변한것을 감지하고, 변했을 시,
        // componentWillUnmount 와 componentDidMount 메소드를 임의로 실행해주세요 
        // – 이렇게 한다고 다시 Mount 되는것은 아니지만, 
        // unmount 될 때와 mount 될 때 저희가 실행하도록 지정한 코드들을 실행 할 수 있습니다.
    }


    componentWillUnmount() {
        // 컴포넌트가 DOM 에서 사라진 후 실행되는 메소드입니다.

        // STOPS THE loadMemoLoop
        clearTimeout(this.memoLoaderTimeoutId);
        
        // Event remove
        window.removeEventListener('scroll',this.scrollEvent, true);

        this.setState({
            initiallyLoaded: false
        });
    }
    
    loadNewMemo() {
        // CANCEL IF THERE IS A PENDING REQUEST
        if(this.props.listStatus === 'WAITING') { 
            return new Promise((resolve, reject)=> {
                resolve();
                // 메모 요청 상태가 ‘WAITING’ 일 때는 로딩을 하지 않도록 하게 했는데요,
                // 잠시 후, 새 메모를 작성 할 때 새 메모를 읽게 끔 트리거 하는 기능도 구현 할 텐데, 
                // 상태가 ‘WAITING’ 일때 무시하는 코드를 넣지 않으면
                // 똑같은 요청을 두번 할 수 도 있게 되기 때문입니다.

                //  Promise 를 리턴한 이유는, Write 에서 해당 메소드를 입력하고 
                //  .then 을 사용 할 수 있게 만들기 위함입니다
                // (메소드를 실행 하고, 성공메시지 / Write 내용초기화를 할건데, 
                // 여기서 그냥 return; 을 날려버리면 만약에 요청이 중첩됐을 때 먹통이 됩니다)
            });
        }
        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if(this.props.memoData.length === 0 ) {
            return this.props.memoListRequest(true, undefined, undefined, this.props.username);
            // 페이지가 비어있을 경우에는 초기로딩을 시도하도록 하였습니다.
        }    
        return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id, this.props.username);
        // 첫번째의 new 일경우에만 게시글을 맨위로 불러옴 this.props.memoData[0]
    }

    loadOldMemo() {
        console.log(this.props.memoData[0]._id);
        // 현재 읽고 있는 페이지가 마지막 페이지라면 요청이 취소 함수
        if(this.props.isLast) {
            return new Promise(
                // 나중에 이 메소드를 사용하고 .then() 을 
                // 사용 할 수 있도록 취소 할 땐, 비어있는 Promise 를 리턴
                (resolve, reject)=> {
                    resolve();
                }
            );
        }
        // GET ID OF THE MEMO AT THE BOTTOM
        let lastId = this.props.memoData[this.props.memoData.length - 1]._id;
        // 이전 메모들을 불러오기위하여 페이지에 로드된 메모 중 최하단 메모의 id 를 API로 전해줍

        // START REQUEST
        return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
            // API 를 실행 후, 만약에 방금 읽어들인 페이지가 마지막페이지라면 알림을 띄웁
            // IF IT IS LAST PAGE, NOTIFY
            if(this.props.isLast) {
                console.log('더이상 출력할것이 없습니다.');
            }
        });
    }

    handleEdit(id, index, contents) {
        return this.props.memoEditRequest(id, index, contents)
        .then(
            () => {
                if( this.props.editStatus.status==="SUCCESS") {
                    console.log('수정 완료했습니다.');
                } else {
                    /*
                        ERROR CODES
                            1: INVALID ID,
                            2: EMPTY CONTENTS
                            3: NOT LOGGED IN
                            4: NO RESOURCE
                            5: PERMISSION FAILURE
                    */
                   let errorMessage = [
                        'Something broke',
                        'Please write soemthing',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    let error = this.props.editStatus.error;
                    // NOTIFY ERROR
                    console.log(errorMessage[error - 1])
                
                    // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                    if(error === 3) {
                        setTimeout(()=> {window.location.reload(false)}, 2000);
                    }
                }
            }
        )
    }

    handleRemove(id, index) {
        return this.props.memoRemoveRequest(id, index)
        .then( 
            () => {
                console.log('조건문 내부');
                if(this.props.removeStatus.status==="SUCCESS") {
                    // 스크롤 바가없는 경우 더 많은 메모를로드하십시오.
                    // 1 초. (애니메이션 1SEC)
                    console.log('Home');
                    setTimeout( ()=> {
                        let documentH = document.documentElement.offsetHeight;  // 지금화면의 document높이
                        let windowH = window.innerHeight;   // 자신이보는 화면의 높이
                        // IF THE SCROLLBAR DOES NOT EXIST,
                        if(documentH < windowH) {
                            this.loadOldMemo();
                        }
                    }, 1000);
                } else {
                    // ERROR
                    /*
                        DELETE MEMO: DELETE /api/memo/:id
                        ERROR CODES
                            1: INVALID ID
                            2: NOT LOGGED IN
                            3: NO RESOURCE
                            4: PERMISSION FAILURE
                    */
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist',
                        'You do not have permission'
                    ];
            
                    // NOTIFY ERROR
                    console.log(errorMessage[this.props.removeStatus.error - 1]);


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.removeStatus.error === 2) {
                        setTimeout(()=> {window.location.reload(false)}, 2000);
                    }
                }
            }
        );
    }

    handleStar(id, index) {
        this.props.memoStarRequest(id, index)
        .then(
            () => {
                if(this.props.starStatus !== 'SUCCESS') {
                    /*
                        TOGGLES STAR OF MEMO: POST /api/memo/star/:id
                        ERROR CODES
                            1: INVALID ID
                            2: NOT LOGGED IN
                            3: NO RESOURCE
                    */
                   let errorMessage= [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist'
                    ];
                
                
                    // NOTIFY ERROR
                    console.log(errorMessage[this.props.starStatus.error - 1]);


                    // 로그인하지 않은 경우 페이지를 새로 고칩니다.
                    if(this.props.starStatus.error === 2) {
                        console.log('로그인을 해주세요.');
                        setTimeout(()=> {window.location.reload(false)}, 2000);
                    }
                }
            }
        )
    }

    render() {
        const write = ( 
            <Write onPost={this.handlePost}/>
        );

        const emptyView = (
            <div className="container">
                <div className="empty-page">
                    <b>{this.props.username}</b> isn't registered or hasn't written any memo
                </div>
            </div>
        );
        
        const wallHeader = (
            <div>
                <div className="container wall-info">
                    <div className="card wall-info blue lighten-2 white-text">
                        <div className="card-content">
                            {this.props.username}
                        </div>
                    </div>
                </div>
                { this.props.memoData.length === 0 && this.state.initiallyLoaded ? emptyView : undefined }
            </div>
        );

        return (
            <div className="wrapper">
                { typeof this.props.username !== "undefined" ? wallHeader : undefined }
                { this.props.isLoggedIn && typeof this.props.username === "undefined" ? write : undefined }
                <MemoList
                    data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}
                    onRemove={this.handleRemove}
                    onStar = {this.handleStar}
                />
            </div>
        );
    }
}

Home.PropTypes = {
    username: PropTypes.string
};

Home.defaultProps = {
    username: undefined
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn : state.authentication.status.isLoggedIn,
        postStatus : state.memo.post,
        // 여기서 state.memo 액션 리듀서(module/index.js)의 memo를 의미
        // post 는 module/memo의 handleActions 내부위 post 를 모두가져온다는 의미
        currentUser: state.authentication.status.currentUser,
        memoData: state.memo.list.data,
        listStatus: state.memo.list.status,
        isLast: state.memo.list.isLast,
        // 마지막 페이지에 도달 했을 시, 요청을 취소하기 위함
        editStatus: state.memo.edit,
        // module/memo 의 edit 의 state 상태를 가져옴 ex succecc나 faile
        removeStatus : state.memo.remove,
        starStatus : state.memo.star
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest : (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents));
        },     
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index));
        },
        memoStarRequest : (id, index) => {
            return dispatch(memoStarRequest(id, index));
        }
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Home)
);