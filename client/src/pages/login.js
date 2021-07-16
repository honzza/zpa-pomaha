import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Paper, Link, SvgIcon } from "@material-ui/core";
import DirectionsRunOutlinedIcon from "@material-ui/icons/DirectionsRunOutlined";
import DirectionsBikeOutlinedIcon from "@material-ui/icons/DirectionsBikeOutlined";
import PoolOutlinedIcon from "@material-ui/icons/PoolOutlined";

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: "center",
    fontFamily: "Montserrat",
    fontSize: "4em",
    [theme.breakpoints.down("sm")]: { padding: "0px 10px" },
    [theme.breakpoints.up("md")]: { padding: "0px 50px" },
    marginTop: "20px",
  },
  text2: {
    color: "#FC4C02",
    textAlign: "center",
    marginTop: "20px",
  },
  container: {
    [theme.breakpoints.down("sm")]: { width: "90%" },
    [theme.breakpoints.up("md")]: { width: "60%" },
    margin: "auto",
  },
  icon: { fontSize: 80, margin: 20, color: "#999999" },
}));

const Login = () => {
  const classes = useStyles();

  const HikeIcon = (
    <SvgIcon className={classes.icon}>
      <path d="M13.5,5.5c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S12.4,5.5,13.5,5.5z M17.5,10.78c-1.23-0.37-2.22-1.17-2.8-2.18l-1-1.6 c-0.41-0.65-1.11-1-1.84-1c-0.78,0-1.59,0.5-1.78,1.44S7,23,7,23h2.1l1.8-8l2.1,2v6h2v-7.5l-2.1-2l0.6-3c1,1.15,2.41,2.01,4,2.34V23 H19V9h-1.5L17.5,10.78z M7.43,13.13l-2.12-0.41c-0.54-0.11-0.9-0.63-0.79-1.17l0.76-3.93c0.21-1.08,1.26-1.79,2.34-1.58l1.16,0.23 L7.43,13.13z" />
    </SvgIcon>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      align="center"
      className={classes.container}
    >
      <Paper elevation={3}>
        <Typography className={classes.text}>pohyb pomáhá</Typography>
        <DirectionsRunOutlinedIcon className={classes.icon} />
        <DirectionsBikeOutlinedIcon className={classes.icon} />
        <PoolOutlinedIcon className={classes.icon} />
        {HikeIcon}

        <Typography className={classes.text2}>
          pokračujte prosím přihlášením do aplikace kliknutím na tlačítko níže
        </Typography>
        <Box my={"30px"}>
          <Link
            component="button"
            onClick={() => {
              window.open(
                `${process.env.REACT_APP_BACKEND_PATH}/auth/strava`,
                "_self"
              );
            }}
          >
            <img
              src="btn_strava_connectwith_orange.svg"
              alt="Connect with STRAVA"
              width="220px"
            />
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
