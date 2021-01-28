//import './App.css';
import Layout from "./components/Layout";
import AuthContext from "./context/auth-context";
import React, { useState, useCallback, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import LoadingSpinner from "./components/UIElements/LoadingSpinner";

const Login = React.lazy(() => import("./pages/login"));
const User = React.lazy(() => import("./pages/user"));
const Ride = React.lazy(() => import("./pages/ride"));
const Run = React.lazy(() => import("./pages/run"));
const Swim = React.lazy(() => import("./pages/swim"));
const About = React.lazy(() => import("./pages/about"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <Layout>
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Switch>
                {isLoggedIn && (
                  <Switch>
                    <Route exact path="/dashboard" component={User} />
                    <Route exact path="/ride" component={Ride} />
                    <Route exact path="/run" component={Run} />
                    <Route exact path="/swim" component={Swim} />
                    <Route exact path="/about" component={About} />
                    <Redirect to="/dashboard" />
                  </Switch>
                )}
                <Route exact path="/login" component={Login} />
                <Redirect to="/login" />
              </Switch>
            </Suspense>
          </main>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
