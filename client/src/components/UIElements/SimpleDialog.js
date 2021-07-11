import React from "react";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export default function SimpleDialog(props) {
  const { onClose, open, clubList } = props;

  const handleClose = () => {
    onClose(clubList[0]);
  };

  const handleListItemClick = (x) => {
    onClose(x);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Vyberte Strava klub</DialogTitle>
      <List sx={{ pt: 0 }}>
        {clubList.map((x) => (
          <ListItem
            button
            onClick={() => handleListItemClick(x)}
            key={x.club_id}
          >
            <ListItemAvatar>
              <Avatar src={x.club_avatar} variant="rounded" />
            </ListItemAvatar>
            <ListItemText primary={x.club_name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
