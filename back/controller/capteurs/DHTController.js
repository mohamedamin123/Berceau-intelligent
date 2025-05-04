const dhtService = require("./../../service/capteurs/DHTService")

// Ajouter des données DHT (température & humidité)
exports.saveDHTData = async (req, res) => {
    try {
        const { berceauId, tmp, hmd } = req.body;
        await dhtService.saveDHTData(berceauId, tmp, hmd);
        res.status(200).json({ message: "Données DHT enregistrées avec succès !" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer température et humidité
exports.getDHTData = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await dhtService.getDHTData(berceauId);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer uniquement la température
exports.getTmp = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const tmp = await dhtService.getTmp(berceauId);
        res.status(200).json({ tmp });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer uniquement l'humidité
exports.getHmd = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const hmd = await dhtService.getHmd(berceauId);
        res.status(200).json({ hmd });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
