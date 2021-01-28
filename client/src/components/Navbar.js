import {
  // List,
  Box,
  Flex,
  Heading,
  useColorMode,
  DarkMode,
  Image,
  Stack,
  Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FiLogOut, FiInfo, FiHome } from "react-icons/fi";
//import NavLinkWrapper from "./UIElements/NavLinkWrapper";
import NavIcon from "./UIElements/NavIcon";
import AuthContext from "../context/auth-context";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useContext(AuthContext);

  return (
    <Box
      backgroundColor="#25283d"
      color="#fff"
      height={{ base: "100px", lg: "70px" }}
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify={{ base: "", lg: "space-between" }}
        align="center"
        maxWidth="1300px"
        mx="auto"
        height="100%"
        px="40px"
      >
        <Stack direction="row" align="center">
          <Image
            boxSize={{ base: "80px", lg: "60px" }}
            display={{ base: "none", lg: "inline" }}
            src="zpa.png"
            alt="ZPA logo"
            mr="15px"
          />
          <Heading
            as="h1"
            fontWeight="200"
            fontSize={{ base: "26px", lg: "32px" }}
            my={{ base: "10px", lg: "0" }}
          >
            ZPA pomáhá sportem
          </Heading>
        </Stack>
        {auth.isLoggedIn && (
          <Box display="flex">
            {/* <List display="flex">
              <NavLinkWrapper path="/ride" text="cyklo" />
              <NavLinkWrapper path="/run" text="běh" />
              <NavLinkWrapper path="/swim" text="plavání" />
            </List> */}
            <DarkMode>
              <NavLink to="/dashboard">
                <NavIcon as={FiHome} label="Úvod" aria="Dashboard" p="7px" />
              </NavLink>
              <NavLink to="/about">
                <NavIcon as={FiInfo} label="O aplikaci" aria="About" p="7px" />
              </NavLink>
              <NavIcon
                label="Světlý/Tmavý mód"
                aria="Toggle dark mode"
                icon={{ light: <MoonIcon />, dark: <SunIcon /> }[colorMode]}
                action={toggleColorMode}
              />
              <Link
                onClick={() => {
                  window.open(
                    `${process.env.REACT_APP_BACKEND_PATH}/auth/logout`,
                    "_self"
                  );
                  auth.logout();
                }}
              >
                <NavIcon
                  as={FiLogOut}
                  label="Odhlášení z aplikace"
                  aria="Logout"
                  p="7px"
                />
              </Link>
            </DarkMode>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
