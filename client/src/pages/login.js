import { Image, Box, Text, Link } from "@chakra-ui/react";
import AuthContext from "../context/auth-context";
import { useContext } from "react";
import { useEffect } from "react";

const Login = () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetch("http://localhost:5000/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        console.log(response);

        if (response.status === 200) return auth.login();
        //response.json();

        throw new Error("Failed to authenticate user");
      })
      .catch((err) => {
        auth.logout();
      });
  });

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
        onClick={() =>
          window.open("http://localhost:5000/auth/strava", "_self")
        }
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
