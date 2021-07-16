import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  text: {
    [theme.breakpoints.down("sm")]: { fontSize: "150%" },
    [theme.breakpoints.up("md")]: { fontSize: "200%" },
    marginBottom: "40px",
    color: "#FFFFFF",
  },
  text2: {
    color: "#FFFFFF",
    marginBottom: "15px",
  },
  container: {
    height: "100vh",
    background: "#3F51B5",
  },
  progress: {
    width: "20vw",
  },
}));

const Splash = () => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      className={classes.container}
    >
      <Typography className={classes.text}>pohyb pomáhá</Typography>
      <Typography className={classes.text2}>načítám aplikaci...</Typography>
      <Box className={classes.progress}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default Splash;
