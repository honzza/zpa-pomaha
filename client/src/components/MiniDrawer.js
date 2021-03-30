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
  SvgIcon,
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
      text: "Chůze",
      link: "/walk",
      icon: (
        <SvgIcon>
          <path d="M13.5,5.5c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S12.4,5.5,13.5,5.5z M17.5,10.78c-1.23-0.37-2.22-1.17-2.8-2.18l-1-1.6 c-0.41-0.65-1.11-1-1.84-1c-0.78,0-1.59,0.5-1.78,1.44S7,23,7,23h2.1l1.8-8l2.1,2v6h2v-7.5l-2.1-2l0.6-3c1,1.15,2.41,2.01,4,2.34V23 H19V9h-1.5L17.5,10.78z M7.43,13.13l-2.12-0.41c-0.54-0.11-0.9-0.63-0.79-1.17l0.76-3.93c0.21-1.08,1.26-1.79,2.34-1.58l1.16,0.23 L7.43,13.13z" />
        </SvgIcon>
      ),
    },
    {
      text: "Pomáháme",
      link: "/charity",
      icon: <FavoriteBorderOutlinedIcon />,
    },
    { text: "O aplikaci", link: "/about", icon: <InfoOutlinedIcon /> },
  ];

  const { name, avatar, uid } = props.user;

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
            ZPA pomáhá sportem - {new Date().getFullYear() - 2018 + 1}. ročník
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
        <Footer uid={uid} />
      </main>
    </div>
  );
}
