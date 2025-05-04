const express = require("express");
const { saveSon, getSon } = require("../../controller/capteurs/sonController");
const router = express.Router();

// Sauvegarder les données Mouvement (POST)
router.post("/", saveSon);

// Récupérer température et humidité
router.get("/:berceauId", getSon);


module.exports = router;
