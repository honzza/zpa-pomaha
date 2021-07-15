import { createContext } from "react";

const ConfigContext = createContext({
  appConfig: {
    app_title: "Pohyb pomáhá",
  },
});

export default ConfigContext;
