import { Text, Image, Link, Box } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box position="fixed" bottom="6" left="0" right="0" textAlign="center">
      <Text color="#999999">created with 🍺 by honzza dvorak, v1.0.0</Text>
      <Link href="https://www.strava.com" isExternal></Link>
      <Box position="fixed" bottom="2" right="2">
        <Image
          src="api_logo_pwrdBy_strava_horiz_gray.svg"
          alt="Powered by STRAVA"
          htmlWidth="170px"
          mt="10px"
        />
      </Box>
    </Box>
  );
}
