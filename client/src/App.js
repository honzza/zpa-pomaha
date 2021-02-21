import MiniDrawer from "./components/MiniDrawer";
import AuthContext from "./context/auth-context";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const Login = React.lazy(() => import("./pages/login"));
const User = React.lazy(() => import("./pages/user"));
const Run = React.lazy(() => import("./pages/run"));
const Ride = React.lazy(() => import("./pages/ride"));
const Nski = React.lazy(() => import("./pages/nski"));
const Swim = React.lazy(() => import("./pages/swim"));
const About = React.lazy(() => import("./pages/about"));

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //  const [error, setError] = useState();

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  // Get user login status
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/auth/login/success`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const responseData = await response.json();
        if (responseData.success === true) {
          setIsLoggedIn(true);
          setIsLoading(false);
          return <Redirect to="/dashboard" />;
        }
        throw new Error(responseData.message);
      } catch (err) {
        console.log(err);
        // setError(err.message || "Something went wrong, please try again");
        setIsLoading(false);
        return setIsLoggedIn(false);
      }
    };
    sendRequest();
  }, []);

  // Update activity stats
  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/update`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const responseData = await response.json();
        setIsLoading(false);
        if (responseData.success === false) {
          throw new Error(responseData.message);
        }
      } catch (err) {
        console.log(err);
        // setError(err.message);
      }
    };
    sendRequest();
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route exact path="/dashboard" component={User} />
        <Route exact path="/run" component={Run} />
        <Route exact path="/ride" component={Ride} />
        <Route exact path="/nski" component={Nski} />
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
        <MiniDrawer>
          <main>
            {isLoading && (
              <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
            {!isLoading && (
              <Suspense
                fallback={
                  <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                }
              >
                {routes}
              </Suspense>
            )}
          </main>
        </MiniDrawer>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
