const { realtimeDb } = require("./../../config/firebaseConfig");

exports.changeMode = async (berceauId) => {
    try {
        // Récupérer l'état actuel du mode
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/ventilateur/mode`).once('value');
        let mode = snapshot.val();

        // Définir le mode par défaut ou basculer entre automatique et manuelle
        if (!mode) {
            mode = "automatique";
        } else {
            mode = mode === "automatique" ? "manuelle" : "automatique";
        }

        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur`).set({ etat: true, mode });
        console.log(`Ventilateur marche en mode ${mode} pour berceauId: ${berceauId}`);
        return mode;
    } catch (error) {
        console.error("Erreur lors de l'allumage de la Ventilateur :", error);
        throw error;
    }
};

// Éteindre la Ventilateur
exports.off = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur/etat`).set(false);
        console.log(`Ventilateur éteinte pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la Ventilateur :", error);
        throw error;
    }
}; // Fermeture correcte de la fonction off


// Éteindre la Ventilateur
exports.on = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur/etat`).set(true);
        console.log(`Ventilateur marche pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la Ventilateur :", error);
        throw error;
    }
}; // Fermeture correcte de la fonction off

exports.getData = async (berceauId) => {
    try {
        const ref = realtimeDb.ref(`berceaux/${berceauId}/ventilateur`);
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
    } catch (error) {
        console.error("Erreur lors de la récupération des données du ventilateur :", error);
        throw error;
    }
};