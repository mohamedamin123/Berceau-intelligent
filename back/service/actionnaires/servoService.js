const { realtimeDb } = require("./../../config/firebaseConfig");

exports.changeMode = async (berceauId) => {
    try {
        // Récupérer l'état actuel du mode
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/servo/mode`).once('value');
        let mode = snapshot.val();

        // Définir le mode par défaut ou basculer entre automatique et manuelle
        if (!mode) {
            mode = "automatique";
        } else {
            mode = mode === "automatique" ? "manuelle" : "automatique";
        }

        await realtimeDb.ref(`berceaux/${berceauId}/servo`).set({ etat: true, mode });
        console.log(`Servo marche en mode ${mode} pour berceauId: ${berceauId}`);
        return mode;
    } catch (error) {
        console.error("Erreur lors de l'allumage de la servo :", error);
        throw error;
    }
};

// Éteindre la servo
exports.off = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/servo/etat`).set(false);
        console.log(`Servo éteinte pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la servo :", error);
        throw error;
    }
}; // Fermeture correcte de la fonction off


// Éteindre la servo
exports.on = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/servo/etat`).set(true);
        console.log(`Servo marche pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la servo :", error);
        throw error;
    }
}; // Fermeture correcte de la fonction off

exports.getData = async (berceauId) => {
    try {
        const ref = realtimeDb.ref(`berceaux/${berceauId}/servo`);
        const snapshot = await ref.once("value");
        let data = snapshot.val();

        // Si les données n'existent pas, initialiser les valeurs par défaut
        if (!data) {
            const defaultData = {
                etat: true, // Ventilateur éteint par défaut
                mode: "automatique", // Mode automatique par défaut
            };
            await ref.set(defaultData); // Enregistrer les valeurs par défaut dans Firebase
            data = defaultData; // Utiliser les valeurs par défaut pour la réponse
        }

        return data;
    }catch (error) {
        console.error("Erreur lors de la récupération des données de la servo :", error);
        throw error;
    }
};