import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "1jdshdjsh",
      firstname: "honzza",
      lastname: "dvorak",
      activity: {
        ride: { m: 0, kc: 0 },
        run: { m: 5503, kc: 5.503 },
        swim: { m: 0, kc: 0 },
      },
    },
    {
      id: "skjdks2",
      firstname: "helca",
      lastname: "dvorak",
      activity: {
        ride: { m: 1000, kc: 10 },
        run: { m: 5503, kc: 5.503 },
        swim: { m: 0, kc: 0 },
      },
    },
    {
      id: "dkdjf3fdf",
      firstname: "eva",
      lastname: "dvorak",
      activity: {
        ride: { m: 0, kc: 0 },
        run: { m: 5503, kc: 7 },
        swim: { m: 2000, kc: 200 },
      },
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
