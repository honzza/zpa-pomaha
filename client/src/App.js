//import './App.css';
import Layout from "./components/Layout";
import AuthContext from "./context/auth-context";
import React, { useState, useCallback, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

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

  let routes;

  useEffect(() => {
    const sendRequest = async () => {
      //setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/auth/login/success`,
          { credentials: "include" }
        );
        const responseData = await response.json();
        if (response.status === 200) {
          return setIsLoggedIn(true);
        }
        throw new Error(responseData.message);
      } catch (err) {
        console.log(err);
        // setError(err.message || "Something went wrong, please try again");
        return setIsLoggedIn(false);
      }
      //setIsLoading(false);
    };

    // fetch(`${process.env.REACT_APP_BACKEND_PATH}/api/update`, {
    //   credentials: "include",
    // });
    console.log(isLoggedIn);
    sendRequest();
  }, []);

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
        <Route exact path="/login" component={Login} />
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
          <main>
            <Suspense fallback={<h1>Loading...</h1>}>{routes}</Suspense>
          </main>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
