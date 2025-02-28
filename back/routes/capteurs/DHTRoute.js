const express = require("express");
const { saveDHTData ,getDHTData,getTmp,getHmd } = require("../../controller/capteurs/DHTController");
const router = express.Router();

// Sauvegarder les données DHT (POST)
router.post("/", saveDHTData);

// Récupérer température et humidité
router.get("/:berceauId", getDHTData);

// Récupérer uniquement la température
router.get("/tmp/:berceauId", getTmp);

// Récupérer uniquement l'humidité
router.get("/hmd/:berceauId", getHmd);

module.exports = router;
