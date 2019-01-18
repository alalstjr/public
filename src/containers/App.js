import React from 'react';
import { Route, withRouter } from "react-router-dom";
import { Header } from '../components';
import { Home, Login, Register } from './';

class App extends React.Component {
    render() {

        /* Check whether current route is login or register using regex */
        let re = /(login|register)/;
        let isAuth = re.test(this.props.location.pathname);

        return (
            <div>
                {isAuth ? undefined : <Header/>}
                {this.props.location.pathname}
                <Route exact path="/" component={Home} />
                <Route path="/home/" component={Home} />
                <Route path="/login/" component={Login} />
                <Route path="/register/" component={Register} />
            </div>
        );
    }
}

export default withRouter(App);