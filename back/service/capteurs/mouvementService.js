const { realtimeDb } = require("./../../config/firebaseConfig");

// Méthode pour mettre à jour uniquement le champ "mouvement"
exports.saveMouvementData = async (berceauId, mouvement) => {
    try {
        // Cibler directement le champ "mouvement" avec .child()
        await realtimeDb.ref(`berceaux/${berceauId}/mouvement`).set(mouvement);
        console.log(`Mouvement mis à jour pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mouvement :", error);
        throw error;
    }
};
exports.getMouvementData = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/mouvement`).once("value");
        return snapshot.val();
    } catch (error) {
        console.error("Erreur lors de la récupération du mouvement :", error);
        throw error;
    }
};
