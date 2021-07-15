const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  const clubParam = req.params.clubId;
  let users;
  try {
    users = await User.find(
      { $and: [{ active: true }, { clubs: parseInt(clubParam) }] },
      "-shortlivedATC -refreshTC -expirationATC -scope -_id -createdAt -updatedAt -active"
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
