import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./user/pages/Users";
import Run from "./activities/pages/Run";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/main" exact>
          <Users />
        </Route>
        <Route path="/run" exact>
          <Run />
        </Route>
        <Redirect to="/main" />
      </Switch>
    </Router>
  );
};

export default App;
