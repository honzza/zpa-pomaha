import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  Button,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const formatterCU = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const formatterKM = new Intl.NumberFormat("cs-CZ", {
  style: "unit",
  unit: "kilometer",
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const useStyles = makeStyles((theme) => ({
  kmPaper: {
    backgroundColor: "#ebebeb",
    padding: "2px",
    textAlign: "center",
  },
  kcPaper: {
    padding: "2px",
    textAlign: "center",
  },
  columnPaper: {
    textAlign: "center",
    backgroundColor: "#C6E2FF",
  },
  columnKcPaper: {
    textAlign: "center",
  },
  columnKmPaper: {
    textAlign: "center",
  },
  detailRow: {
    backgroundColor: "#C6E2FF",
  },
  container: {
    maxHeight: "79vh",
  },
  headCell: {
    verticalAlign: "bottom",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  highlight: {
    background: "#ffcdb5",
    "& > *": {
      borderBottom: "unset",
    },
  },
  nohighlight: {
    background: "inherit",
    "& > *": {
      borderBottom: "unset",
    },
  },
  buttonbox: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "15px 0",
  },
  button: {
    backgroundColor: "#f699cd",
    margin: "0 0 0 10px",
    color: "#ffffff",
  },
  status: {
    padding: "0 10px",
    minWidth: "269px",
    backgroundColor: "#ebebeb",
    textAlign: "right",
  },
}));

const UserList = (props) => {
  const classes = useStyles();
  const { items, uidLogged } = props;

  let disabledButton;

  //Prepare data, sort by sum of Kc
  const results = items.users.map((user) => {
    return {
      ...user,
      kcTotal:
        user.activity.ride.kc +
        user.activity.swim.kc +
        user.activity.run.kc +
        user.activity.nski.kc,
    };
  });

  let sumRunKm = 0;
  let sumRunKc = 0;
  let sumRideKm = 0;
  let sumRideKc = 0;
  let sumNskiKm = 0;
  let sumNskiKc = 0;
  let sumSwimKm = 0;
  let sumSwimKc = 0;
  let sumKc = 0;

  results.forEach((user) => {
    sumRunKm += user.activity.run.m;
    sumRunKc += user.activity.run.kc;
    sumRideKm += user.activity.ride.m;
    sumRideKc += user.activity.ride.kc;
    sumNskiKm += user.activity.nski.m;
    sumNskiKc += user.activity.nski.kc;
    sumSwimKm += user.activity.swim.m;
    sumSwimKc += user.activity.swim.kc;
    sumKc += user.kcTotal;
  });
  const sumKm = sumRunKm + sumRideKm + sumNskiKm + sumSwimKm;
  const resultsSorted = results.sort((a, b) => b.kcTotal - a.kcTotal);

  const columns = [
    { text: "#", km: null, kc: null },
    { text: ":)", km: null, kc: null },
    { text: "SPORTOVEC", km: null, kc: null },
    { text: "BĚH", km: sumRunKm, kc: sumRunKc },
    { text: "CYKLO", km: sumRideKm, kc: sumRideKc },
    { text: "BĚŽKY", km: sumNskiKm, kc: sumNskiKc },
    { text: "PLAVÁNÍ", km: sumSwimKm, kc: sumSwimKc },
    { text: "CELKEM", km: sumKm, kc: sumKc },
  ];

  const SportStats = (props) => {
    const { km, kc } = props;

    return (
      <TableCell>
        <Box display="flex" flexDirection="column">
          <Paper className={classes.kmPaper}>
            {formatterKM.format(km / 1000)}
          </Paper>
          <Box my={"3px"} />
          <Paper className={classes.kcPaper}>{formatterCU.format(kc)}</Paper>
        </Box>
      </TableCell>
    );
  };

  const Row = (props) => {
    const [open, setOpen] = useState(false);
    const {
      avatar,
      uid,
      displayname,
      activity: {
        run: { m: runKM },
      },
      activity: {
        run: { kc: runKC },
      },
      activity: {
        ride: { m: rideKM },
      },
      activity: {
        ride: { kc: rideKC },
      },
      activity: {
        nski: { m: nskiKM },
      },
      activity: {
        nski: { kc: nskiKC },
      },
      activity: {
        swim: { m: swimKM },
      },
      activity: {
        swim: { kc: swimKC },
      },
      kcTotal,
      numactivities,
      validactivities,
    } = props.row;

    const [status, setStatus] = useState("Zatím se nic nestalo");

    const deleteActivities = async (uid) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/user/activities/delete/${uid}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const responseData = await response.json();
        return setStatus(
          `Smazáno ${responseData.deletedCount} aktivit, je nutné načíst stránku znovu`
        );
      } catch (err) {}
    };

    const uploadActivities = async (uid) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_PATH}/api/user/activities/upload/${uid}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const responseData = await response.json();
        return setStatus(responseData);
      } catch (err) {}
    };

    let totalSumRatio = Math.round((kcTotal / sumKc) * 1000) / 10;
    Number.isNaN(totalSumRatio) && (totalSumRatio = 0);
    let kmPerActivity =
      Math.round((runKM + rideKM + swimKM + nskiKM) / validactivities / 100) /
      10;
    Number.isNaN(kmPerActivity) && (kmPerActivity = 0);
    let validActivitiesRatio =
      Math.round((validactivities / numactivities) * 1000) / 10;
    Number.isNaN(validActivitiesRatio) && (validActivitiesRatio = 0);
    let kcTotalPerActivity = Math.round((kcTotal / validactivities) * 10) / 10;
    Number.isNaN(kcTotalPerActivity) && (kcTotalPerActivity = 0);

    return (
      <React.Fragment>
        <TableRow
          key={props.index + 1}
          hover
          className={
            uid === uidLogged ? classes.highlight : classes.nohighlight
          }
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {props.index + 1}
          </TableCell>
          <TableCell>
            <Box align="center">
              {
                <Avatar
                  alt={displayname}
                  src={avatar}
                  variant="rounded"
                  className={classes.large}
                />
              }
            </Box>
          </TableCell>
          <TableCell align="center">
            <Typography>{displayname}</Typography>
          </TableCell>
          <SportStats km={runKM} kc={runKC} />
          <SportStats km={rideKM} kc={rideKC} />
          <SportStats km={nskiKM} kc={nskiKC} />
          <SportStats km={swimKM} kc={swimKC} />
          <TableCell>
            <Typography variant="h5" align="center">
              {formatterCU.format(kcTotal)}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow className={classes.detailRow}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <TableContainer component={Paper}>
                  <Table aria-label="stats details">
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Podíl na celkové částce
                          </Paper>
                        </TableCell>
                        <TableCell align="left">
                          {totalSumRatio + "%"}
                        </TableCell>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Celkový počet aktivit
                          </Paper>
                        </TableCell>
                        <TableCell align="left">{numactivities}</TableCell>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Km na aktivitu
                          </Paper>
                        </TableCell>
                        <TableCell align="left">
                          {kmPerActivity + " km"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Podíl započitatelných aktivit
                          </Paper>
                        </TableCell>
                        <TableCell align="left">
                          {validActivitiesRatio + "%"}
                        </TableCell>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Započitatelné aktivity
                          </Paper>
                        </TableCell>
                        <TableCell align="left">{validactivities}</TableCell>
                        <TableCell align="center">
                          <Paper className={classes.kmPaper}>
                            Výdělek na aktivitu
                          </Paper>
                        </TableCell>
                        <TableCell align="left">
                          {kcTotalPerActivity + " Kč"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {uidLogged === 20023846 && (
                  <div>
                    <Box className={classes.buttonbox}>
                      {numactivities === 0
                        ? (disabledButton = true)
                        : (disabledButton = false)}
                      <Button
                        disabled={disabledButton}
                        variant="contained"
                        size="small"
                        className={classes.button}
                        onClick={() => deleteActivities(uid)}
                      >
                        Smaž aktivity
                      </Button>
                      <Button
                        disabled={!disabledButton}
                        variant="contained"
                        size="small"
                        className={classes.button}
                        onClick={() => uploadActivities(uid)}
                      >
                        Nahraj aktivity
                      </Button>
                    </Box>
                    <Box className={classes.buttonbox}>
                      <Paper className={classes.status}>{status}</Paper>
                    </Box>
                  </div>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const Column = (props) => {
    return (
      <TableCell className={classes.headCell}>
        <Box display="flex" flexDirection="column">
          {props.km > 0 && (
            <Paper className={classes.columnKmPaper}>
              <Typography variant="subtitle1">
                {formatterKM.format(props.km / 1000)}
              </Typography>
            </Paper>
          )}
          <Box my={"3px"} />
          {props.kc > 0 && (
            <Paper className={classes.columnKcPaper}>
              <Typography variant="subtitle1">
                {formatterCU.format(props.kc)}
              </Typography>
            </Paper>
          )}
          <Box my={"3px"} />
          <Paper className={classes.columnPaper}>
            <Typography>{props.text}</Typography>
          </Paper>
        </Box>
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <Column text={column.text} km={column.km} kc={column.kc} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {resultsSorted.map((row, index) => (
            <Row index={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
