const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find(
      {},
      "-uid -shortlivedATC -refreshTC -expirationATC -scope -_id -createdAt -updatedAt"
    );
  } catch (err) {
    return next(
      new HttpError("Fetching user data failed, please try again later", 500)
    );
  }
  if (users.length === 0) {
    return next(new HttpError("Could not find any user", 404));
  }
  res.json({ users: users.map((user) => user.toObject()) });
};

exports.getUsers = getUsers;
