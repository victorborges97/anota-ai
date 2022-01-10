import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import { RecoilRoot } from "recoil";

import FirebaseProvider, { useFirebase } from "../context/firebase";

import Home from "../pages/Home";
import Anotacoes from "../pages/Anotacoes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

function Routes() {
    return (
        <RecoilRoot>
            <FirebaseProvider>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <PrivateRoute path="/anotacoes" exact component={Anotacoes} />
                        <ConfirmRoute path="/login" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Router>
            </FirebaseProvider>
        </RecoilRoot>
    );
}

export default Routes;


// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {

    const { isAuthenticated } = useFirebase()

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    // eslint-disable-next-line react/prop-types
                    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
                )
            }
        />
    )
};

// eslint-disable-next-line react/prop-types
const ConfirmRoute = ({ component: Component, ...rest }) => {

    const { isAuthenticated } = useFirebase()

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    // eslint-disable-next-line react/prop-types
                    <Redirect to={{ pathname: "/anotacoes", state: { from: props.location } }} />
                ) : (
                    <Component {...props} />
                )
            }
        />
    )
};