import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
// import PropTypes from "prop-types";
// import Pagination from "@material-ui/lab/Pagination";
import {
  Box,
  Avatar,
  Tag,
  Flex,
  StatNumber,
  Stat,
  useColorModeValue,
} from "@chakra-ui/react";
//import { csCZ } from '@material-ui/core/locale';

const formatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const themeColor = "#e6e6e6";

const useStyles = makeStyles({
  root: {
    borderRadius: "10px",
    "& .datagrid--header": {
      backgroundColor: themeColor,
      fontFamily: "Montserrat",
      //color: "#666666",
    },
    "& .MuiDataGrid-columnsContainer": {
      position: "sticky",
      top: 0,
      zIndex: 1,
      borderRadius: "10px",
    },
    "& .datagrid--cell": {
      fontFamily: "Montserrat",
      //backgroundColor: "#ffffff",
    },
    // "& .MuiDataGrid-footer": {
    //   backgroundColor: themeColor,
    // },
    // "& .MuiPaginationItem-root": {
    //   fontFamily: "Montserrat",
    // },
  },
});

// function CustomPagination(props) {
//   const { state, api } = props;
//   const classes = useStyles();

//   return (
//     <Pagination
//       className={classes.root}
//       shape="rounded"
//       size="small"
//       hidePrevButton
//       hideNextButton
//       page={state.pagination.page}
//       count={state.pagination.pageCount}
//       onChange={(event, value) => api.current.setPage(value)}
//     />
//   );
// }

// CustomPagination.propTypes = {
//   api: PropTypes.shape({
//     current: PropTypes.object.isRequired,
//   }).isRequired,
//   state: PropTypes.object.isRequired,
// };

const UsersList = (props) => {
  const modeColor = useColorModeValue("gray.900", "gray.300");
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
        user.activity.ride.kc +
        user.activity.swim.kc +
        user.activity.run.kc +
        user.activity.nski.kc,
    };
  });
  const resultsSorted = results.sort((a, b) => b.kcTotal - a.kcTotal);

  //Define rows of grid
  let i = 0;
  const rows = resultsSorted.map((user) => {
    i++;
    return {
      id: i,
      avatar: { url: user.avatar, name: user.displayname },
      displayName: user.displayname,
      run: {
        km: Math.round(user.activity.run.m / 100) / 10,
        kc: Math.round(user.activity.run.kc),
      },
      ride: {
        km: Math.round(user.activity.ride.m / 100) / 10,
        kc: Math.round(user.activity.ride.kc),
      },
      nski: {
        km: Math.round(user.activity.nski.m / 100) / 10,
        kc: Math.round(user.activity.nski.kc),
      },
      swim: {
        km: Math.round(user.activity.swim.m / 100) / 10,
        kc: Math.round(user.activity.swim.kc),
      },
      kcTotal: Math.round(user.kcTotal),
    };
  });

  // Define columns of grid
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 65,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => <Box color={modeColor}>{params.value}</Box>,
    },
    {
      field: "avatar",
      headerName: ":)",
      width: 80,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Box mt={3}>
          <Avatar src={params.value.url} name={params.value.name} />
        </Box>
      ),
    },
    {
      field: "displayName",
      headerName: "Sportovec",
      width: 200,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => <Box color={modeColor}>{params.value}</Box>,
    },

    {
      field: "run",
      headerName: "Běh",
      width: 180,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Flex direction="column">
          <Tag mb={1}>{params.value.km} km</Tag>
          <Tag variant="outline" colorScheme="blue">
            {formatter.format(params.value.kc)}
          </Tag>
        </Flex>
      ),
    },
    {
      field: "ride",
      headerName: "Cyklo",
      width: 180,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Flex direction="column">
          <Tag mb={1}>{params.value.km} km</Tag>
          <Tag variant="outline" colorScheme="blue">
            {formatter.format(params.value.kc)}
          </Tag>
        </Flex>
      ),
    },
    {
      field: "nski",
      headerName: "Běžky",
      width: 180,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Flex direction="column">
          <Tag mb={1}>{params.value.km} km</Tag>
          <Tag variant="outline" colorScheme="blue">
            {formatter.format(params.value.kc)}
          </Tag>
        </Flex>
      ),
    },
    {
      field: "swim",
      headerName: "Plavání",
      width: 180,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Flex direction="column">
          <Tag mb={1}>{params.value.km} km</Tag>
          <Tag variant="outline" colorScheme="blue">
            {formatter.format(params.value.kc)}
          </Tag>
        </Flex>
      ),
    },
    {
      field: "kcTotal",
      headerName: "Celkem",
      width: 163,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => (
        <Flex justify="center" color={modeColor}>
          <Stat>
            <StatNumber>{formatter.format(params.value)}</StatNumber>
          </Stat>
        </Flex>
      ),
    },
  ];

  return (
    <Box maxW="1230px" mx="auto" my={{ base: "0px", lg: "15px" }} h="80vh">
      <DataGrid
        className={classes.root}
        //autoHeight
        rowHeight={60}
        headerHeight={40}
        disableSelectionOnClick
        hideFooter
        //pageSize={100}
        //autoPageSize
        //pagination
        // components={{
        //   Pagination: CustomPagination,
        // }}
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
