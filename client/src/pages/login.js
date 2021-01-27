import { Image, Box, Text, Link } from "@chakra-ui/react";
import AuthContext from "../context/auth-context";
import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Login = () => {
  //  const [error, setError] = useState();
  //const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const sendRequest = async () => {
      //setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/auth/login/success`,
          { credentials: "include" }
        );
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.success === true) {
          auth.login();
          console.log(responseData);
          return <Redirect to="/dashboard" />;
        }
        throw new Error(responseData.message);
      } catch (err) {
        console.log(err);
        // setError(err.message || "Something went wrong, please try again");
        return auth.logout();
      }
      //setIsLoading(false);

      // fetch(`${process.env.REACT_APP_BACKEND_PATH}/api/update`, {
      //   credentials: "include",
      // });
    };
    sendRequest();
  }, []);

  return (
    <Box w="50%" margin="auto" p="20px">
      <Image
        src="zpa_login.png"
        alt="ZPA Smart Energy"
        htmlWidth="220px"
        m="auto"
        pb="20px"
      />
      <Text pb="20px" align="center">
        Aplikace ZPA pomáhá sportem vyplňuje mezeru, která vznikla po ukončení
        služby Endomondo. V Endomondu bylo možné založit Challenge, která měla
        svůj žebříček nejlepších pro každou aktivitu. STRAVA, na kterou jsme
        přešli, toto neumožňuje. Proto vznikla tato aplikace, která tyto
        žebříčky opět umožní. Zároveň hned v úvodu je tabulka, kterou Dan jednou
        za čtvrtletí posílal v Excelu. Ta je nyní vždy aktuální.
      </Text>
      <Text fontWeight="600" pb="20px" align="center" color="#FC4C02">
        Pokračujte prosím přihlášením do aplikace kliknutím na tlačítko níže.
      </Text>
      <Link
        onClick={() => {
          window.open(
            `${process.env.REACT_APP_BACKEND_PATH}/auth/strava`,
            "_self"
          );
        }}
      >
        <Image
          src="btn_strava_connectwith_orange.svg"
          alt="Connect with STRAVA"
          htmlWidth="290px"
          m="auto"
          p="20px"
        />
      </Link>
    </Box>
  );
};

export default Login;
