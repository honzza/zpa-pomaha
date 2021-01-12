import React from "react";
import { DataGrid } from "@material-ui/data-grid";

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
      kcTotal: user.kcTotal,
    };
  });

  // Define columns of grid
  const columns = [
    { field: "id", headerName: "Pořadí", width: 100 },
    { field: "firstName", headerName: "Jméno", width: 150 },
    { field: "lastName", headerName: "Příjmení", width: 150 },
    { field: "kcTotal", headerName: "Celkem Kč", width: 150 },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default UsersList;
