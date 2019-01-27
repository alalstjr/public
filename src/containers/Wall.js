import React, { Component } from 'react';

import { Home } from 'containers';

class Wall extends Component {
  render() {
    console.log(this.props.match.params);
    return (
        <div>
            <Home username={this.props.match.params.username}></Home>
        </div>
    )
    // 클라이언트 라우팅의 params 는 위와같이 this.props.params.___ 으로 읽어옵니다.
  }
}

export default Wall