import { ListItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import "./NavLinkWrapper.css";

export default function NavLinkWrapper(props) {
  return (
    <ListItem mt="5px">
      <NavLink
        to={props.path}
        activeClassName="nav-active"
        className="nav-link"
      >
        {props.text}
      </NavLink>
    </ListItem>
  );
}
