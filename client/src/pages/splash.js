import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Paper, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: { padding: "0px 10px" },
    [theme.breakpoints.up("md")]: { padding: "0px 50px" },
    marginBottom: "30px",
  },
  text2: {
    fontWeight: 600,
    color: "#FC4C02",
    textAlign: "center",
  },
  container: {
    [theme.breakpoints.down("sm")]: { width: "90%" },
    [theme.breakpoints.up("md")]: { width: "60%" },
    margin: "auto",
  },
  img: {
    maxWidth: "220px",
  },
}));

const Splash = () => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      align="center"
      className={classes.container}
    >
      <Paper elevation={3}>
        <img
          src="zpa_login.png"
          alt="ZPA Smart Energy"
          className={classes.img}
        />
        <Typography className={classes.text}>Toto je splash screen</Typography>
      </Paper>
    </Box>
  );
};

export default Splash;
