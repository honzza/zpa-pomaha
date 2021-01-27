import { useEffect, useState, useContext } from "react";
import UsersList from "../components/UsersList";
import AuthContext from "../context/auth-context";

const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (new Date().getMinutes() % 5 === 0) {
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
          if (responseData.success === false) {
            throw new Error(responseData.message);
          }
        } catch (err) {
          console.log(err);
          // setError(err.message);
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
      } catch (err) {
        console.log(err);
        // setError(err.message);
      }
      setIsLoading(false);
    };
    console.log(auth.isLoggedIn);
    sendRequest();
  }, []);

  // const errorHandler = () => {
  //   setError(null);
  // };

  return (
    <div>{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}</div>
  );
};

export default User;
