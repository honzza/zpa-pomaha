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

const Login = () => {
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
        <Typography className={classes.text}>
          Aplikace ZPA pomáhá sportem vyplňuje mezeru, která vznikla po ukončení
          služby Endomondo. V Endomondu bylo možné založit Challenge, která měla
          svůj žebříček nejlepších pro každou aktivitu. STRAVA, na kterou jsme
          přešli, toto neumožňuje. Proto vznikla tato aplikace, která tyto
          žebříčky opět umožní. Zároveň hned v úvodu je tabulka, kterou Dan
          jednou za čtvrtletí posílal v Excelu. Ta je nyní vždy aktuální.
        </Typography>
        <Typography className={classes.text2}>
          Pokračujte prosím přihlášením do aplikace kliknutím na tlačítko níže.
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
