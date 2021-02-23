import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const WarningAlert = (props) => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle mr={2}>Jejda, něco se stalo!</AlertTitle>
      <AlertDescription>{props.error}</AlertDescription>
    </Alert>
  );
};

export default WarningAlert;
