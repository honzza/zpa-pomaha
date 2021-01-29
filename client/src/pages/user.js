import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";

const User = () => {
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
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </div>
  );
};

export default User;
