const SonService = require("../../service/capteurs/sonService");

// Ajouter des données Son (etat & type)
exports.saveSon = async (req, res) => {
    try {
        console.log("Requête reçue :", req.body);
        const { berceauId, son } = req.body;

        // Validation minimale
        if (!berceauId || typeof son !== 'object') {
            return res.status(400).json({ error: "Champs manquants ou invalides" });
        }

        const { etat, type } = son;
        if (typeof etat !== 'boolean' || typeof type !== 'string') {
            return res.status(400).json({ error: "Le champ 'son' doit contenir { etat: boolean, type: string }" });
        }

        await SonService.saveSon(berceauId, { etat, type });
        res.status(200).json({ message: "Données Son enregistrées avec succès !" });
    } catch (error) {
        console.error("Erreur lors de saveSon:", error);
        res.status(400).json({ error: error.message });
    }
};

// Récupérer le son (etat & type)
exports.getSon = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await SonService.getSon(berceauId);

        if (!data) {
            return res.status(404).json({ error: "Aucune donnée trouvée pour ce berceau" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur lors de getSon:", error);
        res.status(400).json({ error: error.message });
    }
};
