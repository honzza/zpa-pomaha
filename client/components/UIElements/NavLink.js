import NextLink from "next/link";
import { ListItem, Link } from "@chakra-ui/react";

export default function NavLink(props) {
  return (
    <ListItem mt="5px">
      <NextLink href={props.path}>
        <Link _hover={{ borderBottom: "2px #fff solid" }} pb="5px" mx="10px">
          {props.text}
        </Link>
      </NextLink>
    </ListItem>
  );
}
