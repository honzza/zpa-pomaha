import { Text, Flex, Image, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex justify="center" align="center" py="2rem" direction="column">
      <Text>created with 🍺 by honzza dvorak, v1.0.0</Text>
      <Link href="https://www.strava.com" isExternal>
        <Image
          src="api_logo_pwrdBy_strava_horiz_gray.svg"
          alt="Powered by STRAVA"
          htmlWidth="170px"
          mt="10px"
        />
      </Link>
    </Flex>
  );
}
