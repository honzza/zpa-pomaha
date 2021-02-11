import React, { useEffect, useState } from "react";
import ActivityList from "../components/ActivityList";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import WarningAlert from "../components/UIElements/WarningAlert";

const Activity = (type, label) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedActivities, setLoadedActivities] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/activity/${type}`,
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
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedActivities(responseData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    sendRequest();
  }, [type]);

  return (
    <React.Fragment>
      {error && <WarningAlert error={error} />}
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedActivities && (
        <ActivityList items={loadedActivities} type={type} label={label} />
      )}
    </React.Fragment>
  );
};

export default Activity;
