import MiniDrawer from "./components/MiniDrawer";
import Splash from "./components/Splash";
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
import SnackMsg from "./components/UIElements/SnackMsg";
import SimpleDialog from "./components/UIElements/SimpleDialog";
import { useHttpClient } from "./hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";

const Login = React.lazy(() => import("./pages/login"));
const User = React.lazy(() => import("./pages/user"));
const Activity = React.lazy(() => import("./pages/activity"));
const Charity = React.lazy(() => import("./pages/charity"));
const About = React.lazy(() => import("./pages/about"));

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const [appConfig, setAppConfig] = useState({
    app_title: "Pohyb pomáhá",
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isLoading, message, error, sendRequest } = useHttpClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState({
    name: "",
    avatar: "",
  });
  const [open, setOpen] = useState(false);

  const handleClose = (configItem) => {
    setOpen(false);
    setAppConfig(configItem);
  };

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  // Get user login status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_PATH}/auth/login/success`
        );
        if (responseData.success === true) {
          // Load app configuration
          let configData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_PATH}/api/admin/config`
          );
          configData.length > 1 ? setOpen(true) : (configData = configData[0]);
          setAppConfig(configData);
          setIsLoggedIn(true);
          setLoggedUser({
            name: responseData.user.firstname,
            avatar: responseData.user.avatar,
            uid: responseData.user.uid,
          });
          setIsCheckingAuth(false);
          return <Redirect to="/dashboard" />;
        }
      } catch (err) {
        setIsCheckingAuth(false);
        return setIsLoggedIn(false);
      }
    };
    fetchStatus();
  }, [sendRequest]);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route key={1} exact path="/dashboard">
          <User user={loggedUser} />
        </Route>
        <Route key={2} exact path="/run">
          <Activity type="run" label="BĚH" user={loggedUser} />
        </Route>
        <Route key={3} exact path="/ride">
          <Activity type={"ride"} label={"CYKLO"} user={loggedUser} />
        </Route>
        <Route key={4} exact path="/nski">
          <Activity type={"nski"} label={"BĚŽKY"} user={loggedUser} />
        </Route>
        <Route key={5} exact path="/swim">
          <Activity type={"swim"} label={"PLAVÁNÍ"} user={loggedUser} />
        </Route>
        <Route key={6} exact path="/walk">
          <Activity type={"walk"} label={"CHŮZE"} user={loggedUser} />
        </Route>
        <Route key={7} exact path="/charity" component={Charity} />
        <Route key={8} exact path="/about" component={About} />
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route key={1} exact path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      {isCheckingAuth && <Splash />}
      {appConfig && appConfig.length > 1 && (
        <SimpleDialog open={open} onClose={handleClose} clubList={appConfig} />
      )}
      {!isCheckingAuth && !open && (
        <Router>
          {loggedUser && (
            <MiniDrawer user={loggedUser} config={appConfig}>
              <main>
                {error && (
                  <SnackMsg text={error} severity={"info"} history={true} />
                )}
                {isLoggedIn && message && (
                  <SnackMsg text={message} severity={"success"} />
                )}
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
          )}
        </Router>
      )}
    </AuthContext.Provider>
  );
}

export default App;
