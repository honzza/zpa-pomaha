import { Text, Image, Link, Box } from "@chakra-ui/react";

const themeColor = "#999999";

export default function Footer() {
  return (
    <Box position="fixed" bottom="6" left="0" right="0" textAlign="center">
      <Text fontSize="sm" color={themeColor}>
        created with 🍺 by honzza dvorak {new Date().getFullYear()}
      </Text>
      <Link href="https://www.strava.com" isExternal></Link>
      <Box position="fixed" bottom="1" right="1">
        <Image
          src="api_logo_pwrdBy_strava_horiz_gray.svg"
          alt="Powered by STRAVA"
          htmlWidth="140px"
          mt="10px"
        />
      </Box>
    </Box>
  );
}
