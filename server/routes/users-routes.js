const { Router } = require("express");
const router = Router();
const usersControllers = require("../controllers/users-controllers");

router.get("/", usersControllers.getUsers);

module.exports = router;
