import * as types from './search';
import axios from 'axios';
import es6promise from 'es6-promise';
es6promise.polyfill();

/* ----- Memo Search */
// search.js 로 전송

export function searchRequest(username) {
    return (dispath) => {
        dispath(search());

        return axios.get('/api/account/search/' + username )
        .then((response) => {
            // console.log(response.data);
            // 서버에서 응답한 response 을 통하여 자료를 수집
            dispath(searchSuccess(response.data));
        }).catch((error) => {
            dispath(searchFailure(error.response.data.code));
        });
    }
}

export function search() {
    return {
        type : types.search
    }
}

export function searchSuccess(username) {
    return {
        type : types.search_success,
        username
    }
}

export function searchFailure() {
    return {
        type : types.search_failure
    }
}