const express = require("express");

const pushController = require("../controllers/push.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/register", pushController.registerInstallation);

router.delete("/register", pushController.unregisterInstallation);

module.exports = router;
