// React
import React from 'react';
import ReactDOM from 'react-dom';

// Router
import { BrowserRouter } from "react-router-dom";
// 브라우저 히스토리를 이용해서 구현할 라우터
// 하나의 자식만을 가질 수 있기 때문에, div로 감싸야한다. 아니면 자식이 여러명이라는 에러가 뜸.
// 다른 라우팅 컴포넌트(Route, Link)를 사용하기 위해서 기본적으로 감싸줘야 함
// window.history.pushState()로 동작하는 라우터 (리로드 없이 주소만 갱신하는 함수)
// 이와 비슷하게 HashRouter는 Hash(#/)으로 동작하는 Router임

// Container Components
import { App } from './containers';

// Redux
import { Provider } from 'react-redux';
// Provider 컴포넌트는 connect() 함수를 사용하여 "연결(connect)"할 수 있도록 
// 앱의 store를 "제공(provide)"한다.
// containers 의 login 값을 연결

import store from 'store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);