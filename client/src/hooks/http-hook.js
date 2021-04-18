import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", body = null) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(url, {
        method,
        body,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        signal: httpAbortCtrl.signal,
      });
      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setMessage(responseData.message);
      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, message, error, sendRequest, clearError };
};
