import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Avatar,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DirectionsRunOutlinedIcon from "@material-ui/icons/DirectionsRunOutlined";
import DirectionsBikeOutlinedIcon from "@material-ui/icons/DirectionsBikeOutlined";
import AcUnitOutlinedIcon from "@material-ui/icons/AcUnitOutlined";
import PoolOutlinedIcon from "@material-ui/icons/PoolOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

import AuthContext from "../context/auth-context";
import Footer from "./Footer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    marginRight: "15px",
  },
}));

export default function MiniDrawer(props) {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: "Úvod", link: "/dashboard", icon: <HomeOutlinedIcon /> },
    { text: "Běh", link: "/run", icon: <DirectionsRunOutlinedIcon /> },
    { text: "Cyklo", link: "/ride", icon: <DirectionsBikeOutlinedIcon /> },
    { text: "Běžky", link: "/nski", icon: <AcUnitOutlinedIcon /> },
    { text: "Plavání", link: "/swim", icon: <PoolOutlinedIcon /> },
    {
      text: "Pomáháme",
      link: "/charity",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    { text: "O aplikaci", link: "/about", icon: <InfoOutlinedIcon /> },
  ];

  const { name, avatar } = props.user;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {auth.isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap className={classes.root}>
            ZPA Pomáhá sportem - {new Date().getFullYear() - 2018 + 1}. ročník
          </Typography>
          {avatar && (
            <Avatar
              alt={name}
              src={avatar}
              variant="rounded"
              className={classes.avatar}
            />
          )}
          <Typography variant="h6">{name}</Typography>
        </Toolbar>
      </AppBar>
      {auth.isLoggedIn && (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {menuItems.map((mi, index) => (
              <ListItem key={index} button component={NavLink} to={mi.link}>
                <ListItemIcon>{mi.icon}</ListItemIcon>
                <ListItemText primary={mi.text} />
              </ListItem>
            ))}
            <Link
              onClick={() => {
                window.open(
                  `${process.env.REACT_APP_BACKEND_PATH}/auth/logout`,
                  "_self"
                );
                auth.logout();
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem button key="Odhlásit">
                <ListItemIcon>
                  <ExitToAppOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Odhlásit" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
        <Footer />
      </main>
    </div>
  );
}
