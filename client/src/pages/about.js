import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Backdrop,
  CircularProgress,
  Box,
} from "@material-ui/core";
import SnackMsg from "../components/UIElements/SnackMsg";
import { useHttpClient } from "../hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  columnPaper: {
    textAlign: "center",
    backgroundColor: "#C6E2FF",
  },
  container: {
    maxHeight: "80vh",
  },
  headCell: {
    verticalAlign: "top",
  },
  title: {
    padding: "15px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  img: {
    maxWidth: "180px",
    padding: "20px",
  },
  img2: {
    maxWidth: "100px",
    padding: "20px",
  },
}));

const About = () => {
  const classes = useStyles();
  const { isLoading, error, sendRequest } = useHttpClient();
  const [loadedChanges, setLoadedChanges] = useState();

  useEffect(() => {
    const fetchChanges = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_PATH}/api/admin`
        );
        setLoadedChanges(responseData);
      } catch (err) {}
    };
    fetchChanges();
  }, []);

  const columns = ["DATUM", "VERZE", "ZMĚNA", "POPIS"];

  const Row = (props) => {
    const { date, version, type, description } = props.row;

    return (
      <TableRow key={props.index + 1} hover>
        <TableCell align="center" component="th" scope="row">
          {date}
        </TableCell>
        <TableCell align="center">{version}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell>{description}</TableCell>
      </TableRow>
    );
  };

  const Column = (props) => {
    return (
      <TableCell className={classes.headCell}>
        <Paper className={classes.columnPaper}>
          <Typography>{props.text}</Typography>
        </Paper>
      </TableCell>
    );
  };

  return (
    <React.Fragment>
      {error && <SnackMsg text={error} severity={"warning"} history={true} />}
      <TableContainer component={Paper} className={classes.container}>
        {isLoading && (
          <Backdrop className={classes.backdrop} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Typography variant="h5" align="center" className={classes.title}>
          Novinky a plánovaná rozšíření
        </Typography>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <Column text={column} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              loadedChanges &&
              loadedChanges.map((row, index) => (
                <Row index={index} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={"10px"} align="center">
        <Paper>
          <img src="mern.png" alt="MERN" className={classes.img} />
          <img
            src="api_logo_pwrdBy_strava_stack_gray.svg"
            alt="Powered by STRAVA"
            className={classes.img}
          />
          <img
            src="material-ui-1.svg"
            alt="Material UI"
            className={classes.img2}
          />
        </Paper>
      </Box>
    </React.Fragment>
  );
};

export default About;
