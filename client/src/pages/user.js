import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackMsg from "../components/UIElements/SnackMsg";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const User = (props) => {
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const name = props.user.name;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_PATH}/api/user`,
          "GET",
          null
        );
        setLoadedUsers(responseData);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {error && <SnackMsg text={error} severity={"warning"} history={true} />}
      {isLoading && (
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && loadedUsers && (
        <UsersList items={loadedUsers} name={name} />
      )}
    </React.Fragment>
  );
};

export default User;
