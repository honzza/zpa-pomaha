import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
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
    },
    "& .MuiDataGrid-columnsContainer": {
      position: "sticky",
      top: 0,
      zIndex: 1,
      borderRadius: "10px",
    },
    "& .datagrid--cell": {
      fontFamily: "Montserrat",
    },
  },
});

const ActivityList = (props) => {
  const modeColor = useColorModeValue("gray.900", "gray.300");
  const classes = useStyles();
  const activityType = props.type;
  const activityLabel = props.label;

  //Sort by sum of Kc
  const resultsSorted = props.items.activity.sort(
    (a, b) => b[activityType].kc - a[activityType].kc
  );

  //Define rows of grid
  let i = 0;
  const rows = resultsSorted.map((activity) => {
    i++;
    return {
      id: i,
      avatar: { url: activity.avatar, name: activity.displayname },
      displayName: activity.displayname,
      km: Math.round(activity[activityType].m / 100) / 10,
      kc: Math.round(activity[activityType].kc),
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
      field: "km",
      headerName: activityLabel,
      width: 180,
      headerClassName: "datagrid--header",
      cellClassName: "datagrid--cell",
      renderCell: (params) => <Tag mb={1}>{params.value} km</Tag>,
    },
    {
      field: "kc",
      headerName: "Kč",
      width: 180,
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
    <Box maxW="708px" mx="auto" my={{ base: "0px", lg: "15px" }} h="80vh">
      <DataGrid
        className={classes.root}
        rowHeight={60}
        headerHeight={40}
        disableSelectionOnClick
        hideFooter
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

export default ActivityList;
