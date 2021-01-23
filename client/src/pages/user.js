import UsersList from "../components/UsersList";

const User = () => {
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
        run: { m: 5543, kc: 5.503 },
        swim: { m: 0, kc: 0 },
      },
    },
    {
      id: "dkdjf3fdf",
      firstname: "eva",
      lastname: "dvorak",
      activity: {
        ride: { m: 0, kc: 0 },
        run: { m: 5563, kc: 7 },
        swim: { m: 2000, kc: 200 },
      },
    },
  ];

  return (
    <div>
      <UsersList items={USERS} />
    </div>
  );
};

export default User;