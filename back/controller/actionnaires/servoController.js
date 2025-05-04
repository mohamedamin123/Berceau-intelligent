const servoService = require("./../../service/actionnaires/servoService");

exports.changeMode= async (req, res) => {
    try {
        const { berceauId } = req.params;
        const newMode = await servoService.changeMode(berceauId);
        res.status(200).json({ message: `Servo activée pour berceau ${berceauId}`,mode:newMode });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'activation de la servo" });
    }
};

// Désactiver la servo
exports.off= async (req, res) => {
    try {
        const { berceauId } = req.params;
        await servoService.off(berceauId);
        res.status(200).json({ message: `Servo désactivée pour berceau ${berceauId}` });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la désactivation de la servo" });
    }
};
// Activer la servo
exports.on= async (req, res) => {
    try {
        const { berceauId } = req.params;
        await servoService.on(berceauId);
        res.status(200).json({ message: `Servo activée pour berceau ${berceauId}` });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la désactivation de la servo" });
    }
};

// Récupérer l'état et l'intensité de la servo
exports.getData = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const data = await servoService.getData(berceauId);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
