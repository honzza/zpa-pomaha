import React, { useEffect, useState } from "react";
import ActivityList from "../components/ActivityList";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningAlert from "../components/UIElements/WarningAlert";
import { useHttpClient } from "../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Activity = (type, label) => {
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedActivities, setLoadedActivities] = useState();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_PATH}/api/activity/${type}`,
          "GET",
          null,
          {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          }
        );
        setLoadedActivities(responseData);
      } catch (err) {}
    };
    fetchActivities();
  }, [sendRequest, type]);

  return (
    <React.Fragment>
      {error && <WarningAlert error={error} />}
      {isLoading && (
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && loadedActivities && (
        <ActivityList items={loadedActivities} type={type} label={label} />
      )}
    </React.Fragment>
  );
};

export default Activity;
