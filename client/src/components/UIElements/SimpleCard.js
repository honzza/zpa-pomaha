import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    backgroundColor: "#C6E2FF",
  },
  title: {
    fontSize: 18,
    textAlign: "left",
  },
});

const SimpleCard = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="body2" component="p" color="textSecondary">
          {props.text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleCard;
