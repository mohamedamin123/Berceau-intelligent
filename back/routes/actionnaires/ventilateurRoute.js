const express = require("express");
const { changeMode, off, getData, on,setTemperature} = require("../../controller/actionnaires/ventilateurController");
const router = express.Router();

router.post("/changeMode/:berceauId", changeMode);
router.post("/off/:berceauId", off);
router.post("/on/:berceauId", on);
router.patch("/tmp/:berceauId", setTemperature);


router.get("/:berceauId", getData);

module.exports = router;
