const router = require("express").Router();
const usersControllers = require("../controllers/users-controllers");

router.get("/", usersControllers.getUsers);

module.exports = router;
