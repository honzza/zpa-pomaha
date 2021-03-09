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
  Grid,
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
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "space-around",
  },
}));

const UserList = (props) => {
  const classes = useStyles();
  const { items, uidLogged } = props;

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

  const FormRow = (props) => {
    const { stat1, stat2, stat3 } = props;
    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Box>{stat1.text}</Box>
            <Box>{stat1.value}</Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Box>{stat2.text}</Box>
            <Box>{stat2.value}</Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Box>{stat3.text}</Box>
            <Box>{stat3.value}</Box>
          </Paper>
        </Grid>
      </React.Fragment>
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
                <Grid container spacing={1}>
                  <Grid container item xs={12} spacing={3}>
                    <FormRow
                      stat1={{
                        text: "Podíl na celkové částce",
                        value: Math.round((kcTotal / sumKc) * 1000) / 10 + "%",
                      }}
                      stat2={{
                        text: "Celkový počet aktivit",
                        value: numactivities,
                      }}
                      stat3={{
                        text: "Km na aktivitu",
                        value:
                          Math.round(
                            (runKM + rideKM + swimKM + nskiKM) /
                              validactivities /
                              100
                          ) /
                            10 +
                          " km",
                      }}
                    />
                  </Grid>
                  <Grid container item xs={12} spacing={3}>
                    <FormRow
                      stat1={{
                        text: "Podíl započitatelných aktivit",
                        value:
                          Math.round((validactivities / numactivities) * 1000) /
                            10 +
                          "%",
                      }}
                      stat2={{
                        text: "Započitatelné aktivity",
                        value: validactivities,
                      }}
                      stat3={{
                        text: "Výdělek na aktivitu",
                        value:
                          Math.round((kcTotal / validactivities) * 10) / 10 +
                          " Kč",
                      }}
                    />
                  </Grid>
                </Grid>
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
