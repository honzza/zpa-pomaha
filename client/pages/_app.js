// import '../styles/globals.css'
import Layout from "../components/Layout";
import AuthContext from "../context/auth-context";
import { useState, useCallback } from "react";

export default function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext.Provider>
  );
}
