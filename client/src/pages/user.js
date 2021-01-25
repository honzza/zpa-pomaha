import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";

const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    if (new Date().getMinutes() % 5 === 0) {
      const sendRequest = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_PATH}/api/update`,
            {
              credentials: "include",
            }
          );
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
        } catch (err) {
          setError(err.message);
        }
        setIsLoading(false);
      };
      sendRequest();
    }
  }, []);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/user`,
          {
            credentials: "include",
            //headers: {
            // Accept: "application/json",
            //"Access-Control-Allow-Credentials": true,
            //},
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <div>{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}</div>
  );
};

export default User;
