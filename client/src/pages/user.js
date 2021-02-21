import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const User = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/user`,
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
        if (responseData.success === false) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        // setError(err.message);
      }
    };
    sendRequest();
  }, []);

  // const errorHandler = () => {
  //   setError(null);
  // };

  return (
    <div>
      {isLoading && (
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </div>
  );
};

export default User;
