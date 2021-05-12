import React, { useState } from "react";
//import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@material-ui/core";
import SimpleCard from "../components/UIElements/SimpleCard";

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
  mb: {
    marginBottom: "20px",
  },
  head: {
    backgroundColor: "#ebebeb",
  },
  heading: {
    padding: "20px",
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
        <Typography className={classes.mb}>
          Sportujeme a naše nasportované kilometry ZPA převádí na peníze. Tyto
          peníze pak věnujeme někomu, kdo je potřebuje nebo na projekt, kde
          pomohou změnit věci k lepšímu. Následující tabulka uvádí poměry
          kilometrů na koruny pro jednotlivé aktivity.
        </Typography>
        <TableContainer component={Paper} className={classes.mb}>
          <Table aria-label="km to kc table">
            <TableHead>
              <TableRow className={classes.head}>
                <TableCell align="center">BĚH</TableCell>
                <TableCell align="center">CYKLO</TableCell>
                <TableCell align="center">BĚŽKY</TableCell>
                <TableCell align="center">PLAVÁNÍ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={1}>
                <TableCell align="center">1 km = 1 Kč</TableCell>
                <TableCell align="center">2,5 km = 1 Kč</TableCell>
                <TableCell align="center">1,5 km = 1 Kč</TableCell>
                <TableCell align="center">1 km = 4 Kč</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography>
          Nový ročník ZPA pomáhá sportem startuje pravidelně každý rok od 15.
          prosince.
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box align="center">
          <Paper elevation={3}>
            <Typography variant="h5" className={classes.heading}>
              4. ročník pro Janu Lannen
            </Typography>
            <Box align="left" padding="20px">
              <SimpleCard
                title="Milníky 10.5.2021"
                text={
                  <ul>
                    <li>Jindra Král překročil částku 2 000 Kč</li>
                    <li>Celkově jsme se dostali na 16 000 km a 10 000 Kč</li>
                    <li>
                      V klubu tisícovkářů jsou zatím dva účastníci - Jindra Král
                      a Sáďa
                    </li>
                  </ul>
                }
              />
            </Box>
          </Paper>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box align="center">
          <Paper elevation={3}>
            <Typography variant="h5" className={classes.heading}>
              3. ročník pro slečnu Lucii Nehybovou
            </Typography>
            <img src="zpa_pomaha_2020.jpg" alt="Ročník 3" />
            <Box align="left" padding="20px">
              <SimpleCard
                title="Poděkování od Nehybových"
                text="Dobrý den všem sportovcům, touto cestou bych vám všem chtěla za
              svou dceru Lucku Nehybovou, na kterou se sportovalo minulý rok,
              poděkovat. Za finanční nasportovanou částku pořídíme diabetické
              pomůcky k usnadnění, hlídání a sledování hodnoty cukru. Nehybovi"
              />
            </Box>
          </Paper>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box align="center">
          <Paper elevation={3}>
            <Typography variant="h5" className={classes.heading}>
              2. ročník pro slečnu Vendulku Fenikovou
            </Typography>
            <img src="zpa_pomaha_2019.jpg" alt="Ročník 2" />
          </Paper>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Box align="center">
          <Paper elevation={3}>
            <Typography variant="h5" className={classes.heading}>
              1. ročník pro Šárku Musilovou
            </Typography>
            <img src="zpa_pomaha_2018.jpg" alt="Ročník 1" />
          </Paper>
        </Box>
      </TabPanel>
    </div>
  );
};

export default Charity;
