const SonService = require("../../service/capteurs/sonService")

// Ajouter des données Son (température & humidité)
exports.saveSon = async (req, res) => {
    try {
        console.log(req.body);
        const { berceauId, son  } = req.body;

        await SonService.saveSon(berceauId, son);
        res.status(200).json({ message: "Données Son enregistrées avec succès !" });
    } catch (error) {
        console.log(req.body);

        res.status(400).json({ error: error.message });
    }
};

// Récupérer température et humidité
exports.getSon = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await SonService.getSon(berceauId);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


