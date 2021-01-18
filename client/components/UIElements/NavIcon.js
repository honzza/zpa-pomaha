import { Tooltip, IconButton } from "@chakra-ui/react";

export default function NavIcon(props) {
  return (
    <Tooltip label={props.label}>
      <span>
        <IconButton
          as={props.as}
          aria-label={props.aria}
          icon={props.icon}
          size="sm"
          ml="20px"
          p={props.p}
          onClick={props.action}
        />
      </span>
    </Tooltip>
  );
}
