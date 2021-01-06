const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return next(
      new HttpError("Fetching user data failed, please try again later.", 500)
    );
  }
  if (users.length === 0) {
    return next(new HttpError("Could not find any user.", 404));
  }
  const result = users.map((u) => {
    return {
      firstname: u.firstname,
      lastname: u.lastname,
    };
  });
  res.json(result);
};

exports.getUsers = getUsers;
