import React from "react";
import { Typography, Box } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  text: {
    color: "#999999",
  },
}));

const Footer = (props) => {
  const classes = useStyles();

  return (
    <Box textAlign="center" mt="15px">
      <Typography variant="subtitle2" className={classes.text}>
        developed by three_p {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
