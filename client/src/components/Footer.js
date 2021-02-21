import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  text: {
    color: "#999999",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Box textAlign="center" mt="15px">
      <Typography variant="subtitle2" className={classes.text}>
        made with 🍺 by honzza dvorak {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
