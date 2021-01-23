import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@chakra-ui/react";
//import { csCZ } from '@material-ui/core/locale';

// const formatter = new Intl.NumberFormat("cs-CZ", {
//   style: "currency",
//   currency: "CZK",
//   //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
//   //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
// });

const useStyles = makeStyles({
  root: {
    "& .datagrid--header": {
      backgroundColor: "#b6b6b6",
    },
    "& .datagrid--cell": {},
    backgroundColor: "#ffffff",
  },
});

const UsersList = (props) => {
  const classes = useStyles();

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
      headerName: "Celkem/Kč",
      width: 125,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
    },
  ];

  return (
    <Box maxW="1230px" h="63vh" mx="auto" my="20px">
      <DataGrid
        className={classes.root}
        autoHeight
        disableSelectionOnClick
        hideFooter
        pageSize={100}
        rows={rows}
        columns={columns}
        localeText={{
          columnMenuLabel: "Menu",
          columnMenuFilter: "Filtr",
          columnMenuHideColumn: "Skryj",
          columnMenuUnsort: "Zruš řazení",
          columnMenuSortAsc: "Vzestupně",
          columnMenuSortDesc: "Sestupně",
          columnMenuShowColumns: "Vyber sloupce",
          filterPanelOperators: "Operátor",
          filterPanelDeleteIconLabel: "Zruš",
          filterPanelColumns: "Sloupec",
          columnHeaderFiltersTooltipActive: (count) => `${count} aktivní filtr`,
          columnHeaderSortIconLabel: "Řazení",
          columnsPanelTextFieldLabel: "Najdi sloupec",
          columnsPanelTextFieldPlaceholder: "Název sloupce",
          columnsPanelShowAllButton: "Ukaž vše",
          columnsPanelHideAllButton: "Skryj vše",
        }}
      />
    </Box>
  );
};

export default UsersList;
