const mouvementService = require("./../../service/capteurs/mouvementService")

// Ajouter des données Mouvement (température & humidité)
exports.saveMouvementData = async (req, res) => {
    try {
        console.log(req.body);
        const { berceauId, mvt  } = req.body;

        await mouvementService.saveMouvementData(berceauId, mvt);
        res.status(200).json({ message: "Données Mouvement enregistrées avec succès !" });
    } catch (error) {
        console.log(req.body);

        res.status(400).json({ error: error.message });
    }
};

// Récupérer température et humidité
exports.getMouvementData = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await mouvementService.getMouvementData(berceauId);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


