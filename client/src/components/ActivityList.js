import React from "react";
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
  Avatar,
  Box,
} from "@material-ui/core";

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
  columnPaper: {
    textAlign: "center",
    backgroundColor: "#C6E2FF",
  },
  container: {
    maxHeight: "79vh",
  },
  headCell: {
    verticalAlign: "top",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  highlight: {
    background: "#ffcdb5",
  },
  nohighlight: {
    background: "inherit",
  },
  title: {
    padding: "15px",
  },
}));

const ActivityList = (props) => {
  const classes = useStyles();
  const { items, type, label, uidLogged } = props;

  //Sort by sum of Kc
  const resultsSorted = items.activity.sort((a, b) => b[type].m - a[type].m);

  let columns;
  type === "walk"
    ? (columns = ["#", ":)", "SPORTOVEC", label])
    : (columns = ["#", ":)", "SPORTOVEC", label, "KČ"]);

  const Row = (props) => {
    const {
      avatar,
      uid,
      displayname,
      [type]: { m },
      [type]: { kc },
    } = props.row;

    return (
      <TableRow
        key={props.index + 1}
        hover
        className={uid === uidLogged ? classes.highlight : classes.nohighlight}
      >
        <TableCell align="center" component="th" scope="row">
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
        <TableCell>
          <Paper className={classes.kmPaper}>
            <Typography>{formatterKM.format(m / 1000)}</Typography>
          </Paper>
        </TableCell>
        {type !== "walk" && (
          <TableCell>
            <Typography variant="h5" align="center">
              {formatterCU.format(kc)}
            </Typography>
          </TableCell>
        )}
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
    <TableContainer component={Paper} className={classes.container}>
      {type === "walk" && (
        <Typography variant="h5" align="center" className={classes.title}>
          Nejlepší chodci
        </Typography>
      )}
      {type === "walk" && (
        <Typography align="center">
          (mimo soutěž, pouze chůze delší 5km)
        </Typography>
      )}
      <Table stickyHeader aria-label="table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <Column text={column} />
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

export default ActivityList;
