import { useToast } from "@chakra-ui/react";

const Toast = (props) => {
  const toast = useToast();
  if (props.msg) {
    return toast({
      title: props.msg,
      description: "We've created your account for you.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  }
  return null;
};

export default Toast;
