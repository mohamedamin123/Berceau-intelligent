const VentilateurService = require("../../service/actionnaires/ventilateurService");

exports.changeMode= async (req, res) => {
    try {
        const { berceauId } = req.params;
        const newMode = await VentilateurService.changeMode(berceauId);
        res.status(200).json({ message: `Ventilateur activée pour berceau ${berceauId}`,mode:newMode});
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'activation de la Ventilateur" });
    }
};

// Désactiver la Ventilateur
exports.off= async (req, res) => {
    try {
        const { berceauId } = req.params;
        await VentilateurService.off(berceauId);
        res.status(200).json({ message: `Ventilateur désactivée pour berceau ${berceauId}` });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la désactivation de la Ventilateur" });
    }
};
// Activer la Ventilateur
exports.on= async (req, res) => {
    try {
        const { berceauId } = req.params;
        await VentilateurService.on(berceauId);
        res.status(200).json({ message: `Ventilateur activée pour berceau ${berceauId}` });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la désactivation de la Ventilateur" });
    }
};

// Récupérer l'état et l'intensité de la Ventilateur
exports.getData = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await VentilateurService.getData(berceauId);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
