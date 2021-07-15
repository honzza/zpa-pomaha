import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  loggedUser: {
    name: "",
    avatar: "",
  },
  login: () => {},
  logout: () => {},
});

export default AuthContext;
