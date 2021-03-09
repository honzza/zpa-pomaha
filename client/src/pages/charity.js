import React, { useState } from "react";
//import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

//TabPanel.propTypes = {
//  children: PropTypes.node,
//  index: PropTypes.any.isRequired,
//  value: PropTypes.any.isRequired,
//};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const Charity = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
        >
          <Tab label="Jak pomáháme" {...a11yProps(0)} />
          <Tab label="2021" {...a11yProps(1)} />
          <Tab label="2020" {...a11yProps(2)} />
          <Tab label="2019" {...a11yProps(3)} />
          <Tab label="2018" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Jak Pomáháme
      </TabPanel>
      <TabPanel value={value} index={1}>
        2021
      </TabPanel>
      <TabPanel value={value} index={2}>
        2020
      </TabPanel>
      <TabPanel value={value} index={3}>
        2019
      </TabPanel>
      <TabPanel value={value} index={4}>
        2018
      </TabPanel>
    </div>
  );
};

export default Charity;
