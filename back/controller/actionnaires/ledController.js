const ledService = require("./../../service/actionnaires/ledService");

// Allumer la LED
exports.on = async (req, res) => {
    try {
        const { berceauId } = req.body;
        await ledService.on(berceauId);
        res.status(200).json({ message: "LED allumée avec succès !" });
    } catch (error) {
        console.error("Erreur dans le contrôleur 'on' :", error);
        res.status(400).json({ error: error.message });
    }
};

// Éteindre la LED
exports.off = async (req, res) => {
    try {
        const { berceauId } = req.body;
        await ledService.off(berceauId);
        res.status(200).json({ message: "LED éteinte avec succès !" });
    } catch (error) {
        console.error("Erreur dans le contrôleur 'off' :", error);
        res.status(400).json({ error: error.message });
    }
};

// Modifier l’intensité de la LED
exports.changeIntensity = async (req, res) => {
    try {
        const { berceauId, intensite } = req.body;
        await ledService.changeIntensity(berceauId, intensite);
        res.status(200).json({ message: `Intensité de la LED mise à ${intensite}% avec succès !` });
    } catch (error) {
        console.error("Erreur dans le contrôleur 'changeIntensity' :", error);
        res.status(400).json({ error: error.message });
    }
};

// Récupérer l'état et l'intensité de la LED
exports.getData = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await ledService.getData(berceauId);
        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur dans le contrôleur 'getData' :", error);
        res.status(400).json({ error: error.message });
    }
};
