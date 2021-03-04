import React, { useEffect, useState } from "react";
import ActivityList from "../components/ActivityList";
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

const Activity = (props) => {
  const { type, label } = props;
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedActivities, setLoadedActivities] = useState();
  const name = props.user.name;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_PATH}/api/activity/${type}`,
          "GET",
          null
        );
        setLoadedActivities(responseData);
      } catch (err) {}
    };
    fetchActivities();
  }, []);

  return (
    <React.Fragment>
      {error && <SnackMsg text={error} severity={"warning"} history={true} />}
      {isLoading && (
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && loadedActivities && (
        <ActivityList
          items={loadedActivities}
          type={type}
          label={label}
          name={name}
        />
      )}
    </React.Fragment>
  );
};

export default Activity;
