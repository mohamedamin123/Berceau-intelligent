const express = require("express");
const { saveMouvementData ,getMouvementData } = require("../../controller/capteurs/mouvementController");
const router = express.Router();

// Sauvegarder les données Mouvement (POST)
router.post("/", saveMouvementData);

// Récupérer température et humidité
router.get("/:berceauId", getMouvementData);


module.exports = router;
