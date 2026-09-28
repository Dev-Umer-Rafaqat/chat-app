const express = require("express");
const userController = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect); // every route below requires authentication

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

module.exports = router;
