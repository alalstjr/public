import { createStore, applyMiddleware } from 'redux';
// applyMiddleware 프레임워크에서 미들웨어는 프레임워크가 요청을 받고
// 응답을 만드는 사이에 놓을 수 있는 코드
import thunk from 'redux-thunk';
// 리덕스를 사용하는 어플리케이션에서 비동기 작업을 처리를 도와줌
// thunk란, 특정 작업을 나중에 하도록 미루기 위해서 함수형태로 감싼것
// redux-thunk 를 통해 만든 액션생성자는 그 내부에서 여러가지 작업을 할 수 있습니다. 
// 네트워크 요청을 해도 무방
import reducers from 'module';

const configure = () => {
    const store = createStore(reducers, applyMiddleware(thunk))
    return store;
}

export default configure;