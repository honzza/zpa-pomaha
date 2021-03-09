import React, { useState } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  text: {
    color: "#999999",
  },
  button: { border: "none !important", background: "transparent" },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    margin: "10px",
    padding: "10px",
    textAlign: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Footer = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box textAlign="center" mt="15px">
        <Typography variant="subtitle2" className={classes.text}>
          made with{" "}
          <button type="button" onClick={handleOpen} className={classes.button}>
            <span role="img" aria-label="beer-emoji">
              🍺
            </span>{" "}
          </button>{" "}
          by honzza dvorak {new Date().getFullYear()}
        </Typography>
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Servisní info
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper className={classes.paper} elevation={1}>
          Právě jsi našel(-la) tzv. Easter Egg. Tohle okno není pro běžné
          uživatele, slouží pouze pro ladění aplikace.
        </Paper>
      </Dialog>
    </React.Fragment>
  );
};

export default Footer;
