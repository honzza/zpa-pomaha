//import './App.css';
import Layout from "./components/Layout";
import AuthContext from "./context/auth-context";
import { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Login from "./pages/login";
import User from "./pages/user";
import Ride from "./pages/ride";
import Run from "./pages/run";
import Swim from "./pages/swim";
import About from "./pages/about";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route exact path="/dashboard" component={User} />
        <Route exact path="/ride" component={Ride} />
        <Route exact path="/run" component={Run} />
        <Route exact path="/swim" component={Swim} />
        <Route exact path="/about" component={About} />
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <Layout>
          <main>{routes}</main>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
