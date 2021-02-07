import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";

const About = () => {
  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();
  const [loadedChanges, setLoadedChanges] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/admin`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const responseData = await response.json();
        // if (responseData.success === false) {
        //   throw new Error(responseData.message);
        // }
        setLoadedChanges(responseData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        // setError(err.message);
      }
    };
    sendRequest();
  }, []);

  // const errorHandler = () => {
  //   setError(null);
  // };

  const renderTable = () => {
    return loadedChanges.map((ch) => {
      const { date, version, type, description } = ch;
      return (
        <Tr>
          <Td>{date}</Td>
          <Td>{version}</Td>
          <Td>{type}</Td>
          <Td>{description}</Td>
        </Tr>
      );
    });
  };

  return (
    <Flex
      direction="column"
      align="center"
      maxW="1230px"
      mx="auto"
      my="15px"
      border="1px"
      borderColor="gray.400"
      borderRadius="10px"
    >
      {isLoading && <LoadingSpinner />}
      <Table variant="simple" size="sm" mb="20px">
        <TableCaption placement="top" fontSize="20px" mb="20px">
          Novinky a plánovaná rozšíření
        </TableCaption>
        <Thead>
          <Tr>
            <Th>datum</Th>
            <Th>verze</Th>
            <Th>změna</Th>
            <Th>popis</Th>
          </Tr>
        </Thead>
        <Tbody>{!isLoading && loadedChanges && renderTable()}</Tbody>
      </Table>
      <Image src="mern.png" alt="MERN" htmlWidth="150px" my="20px" />
    </Flex>
  );
};

export default About;
