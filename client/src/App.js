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

import Main from "./pages/main";
import Ride from "./pages/ride";
import Run from "./pages/run";
import Swim from "./pages/swim";
import About from "./pages/about";
import Login from "./pages/login";

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
        <Route path="/main" exact>
          <Main />
        </Route>
        <Route path="/ride" exact>
          <Ride />
        </Route>
        <Route path="/run" exact>
          <Run />
        </Route>
        <Route path="/swim" exact>
          <Swim />
        </Route>
        <Route path="/about" exact>
          <About />
        </Route>
        <Redirect to="/main" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/">
          <Login />
        </Route>
        <Redirect to="/" />
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
