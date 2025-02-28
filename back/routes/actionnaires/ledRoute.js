const express = require("express");
const { on, off, changeIntensity,getData } = require("../../controller/actionnaires/ledController");
const router = express.Router();

router.post("/on", on);
router.post("/off", off);
router.post("/intensite", changeIntensity);
router.get("/:berceauId", getData);

module.exports = router;
