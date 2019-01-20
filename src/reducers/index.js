import authentication from './auth/authentication';

import { combineReducers } from 'redux';
// Reducer를 미세하게 분할하는 경우 
// Redux에서 제공하는 combineReducers함수를 이용

export default combineReducers({
    authentication
});

// const authentication = combineReducers({
//     visibilityFilter,
//     todos
//   });
  
//   export default authentication;

// Store의 문지기
// 함수형 프로그래밍에서 Reducer라는 용어는 합성곱을 의미합니다만, 
// Redux에 한해서는 아래와 같이 이전 상태와 Action을 합쳐, 
// 새로운 state를 만드는 조작을 말합니다.