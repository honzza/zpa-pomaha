import { Image, Box, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext } from "react";
import AuthContext from "../context/auth-context";

export default function Login() {
  const auth = useContext(AuthContext);

  const authClickHandler = () => {
    auth.login();
  };

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
      <NextLink href="/main">
        <Link onClick={() => authClickHandler()}>
          <Image
            src="btn_strava_connectwith_orange.svg"
            alt="Connect with STRAVA"
            htmlWidth="290px"
            m="auto"
            p="20px"
          />
        </Link>
      </NextLink>
    </Box>
  );
}
