import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@chakra-ui/react";

const useStyles = makeStyles({
  root: {
    "& .datagrid--header": {
      backgroundColor: "#25283d",
      color: "white",
    },
    "& .datagrid--cell": {},
  },
});

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>Nebyli nalezeni žádní uživatelé</h2>
      </div>
    );
  }

  //Prepare data, sort by sum of Kc
  const results = props.items.map((user) => {
    return {
      ...user,
      kcTotal:
        user.activity.ride.kc + user.activity.swim.kc + user.activity.run.kc,
    };
  });
  const resultsSorted = results.sort((a, b) => b.kcTotal - a.kcTotal);

  //Define rows of grid
  let i = 0;
  const rows = resultsSorted.map((user) => {
    i++;
    return {
      id: i,
      firstName: user.firstname,
      lastName: user.lastname,
      run: Math.round(user.activity.run.m / 100) / 10,
      ride: Math.round(user.activity.ride.m / 100) / 10,
      swim: Math.round(user.activity.swim.m / 100) / 10,
      runKc: Math.round(user.activity.run.kc),
      rideKc: Math.round(user.activity.ride.kc),
      swimKc: Math.round(user.activity.swim.kc),
      kcTotal: Math.round(user.kcTotal),
    };
  });

  // Define columns of grid
  const columns = [
    {
      field: "id",
      headerName: "Pořadí",
      width: 95,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "firstName",
      headerName: "Jméno",
      width: 150,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "lastName",
      headerName: "Příjmení",
      width: 173,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "run",
      headerName: "Běh/km",
      width: 105,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "ride",
      headerName: "Cyklo/km",
      width: 115,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "swim",
      headerName: "Plavání/km",
      width: 125,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "runKc",
      headerName: "Běh/Kč",
      width: 105,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "rideKc",
      headerName: "Cyklo/Kč",
      width: 110,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "swimKc",
      headerName: "Plavání/Kč",
      width: 125,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
    {
      field: "kcTotal",
      headerName: "Celkem Kč",
      width: 125,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
  ];

  const classes = useStyles();

  return (
    <Box maxW="1230px" h="68vh" mx="auto" my="20px">
      <DataGrid
        className={classes.root}
        autoHeight
        disableSelectionOnClick
        hideFooter
        pageSize="100"
        rows={rows}
        columns={columns}
        localeText={{
          columnMenuLabel: "Menu",
          columnMenuFilter: "Filtr",
          columnMenuHideColumn: "Skryj",
          columnMenuUnsort: "Zruš řazení",
          columnMenuSortAsc: "Vzestupně",
          columnMenuSortDesc: "Sestupně",
          filterPanelOperators: "Operátor",
          filterPanelDeleteIconLabel: "Zruš",
          filterPanelColumns: "Sloupec",
          columnHeaderFiltersTooltipActive: (count) => `${count} aktivní filtr`,
          columnHeaderSortIconLabel: "Řazení",
        }}
      />
    </Box>
  );
};

export default UsersList;
