import { Text, Image, Link, Box } from "@chakra-ui/react";

const themeColor = "#999999";

export default function Footer() {
  return (
    <Box textAlign="center" mt="20px">
      <Text fontSize="sm" color={themeColor}>
        made with 🍺 by honzza dvorak {new Date().getFullYear()}
      </Text>
      <Link href="https://www.strava.com" isExternal></Link>
      <Box position="fixed" bottom="1" right="1">
        <Image
          src="api_logo_pwrdBy_strava_horiz_gray.svg"
          alt="Powered by STRAVA"
          htmlWidth="130px"
          mt="10px"
        />
      </Box>
    </Box>
  );
}
