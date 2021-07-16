import { createContext } from "react";

const ConfigContext = createContext({
  appConfig: {
    app_title: "pohyb pomáhá",
  },
});

export default ConfigContext;
