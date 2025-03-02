const { realtimeDb } = require("./../../config/firebaseConfig");

// Méthode pour mettre à jour uniquement le champ "mouvement"
exports.saveSon = async (berceauId, son) => {
    try {
        // Cibler directement le champ "mouvement" avec .child()
        await realtimeDb.ref(`berceaux/${berceauId}/son`).set(son);
        console.log(`son mis à jour pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du son :", error);
        throw error;
    }
};
exports.getSon = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/son`).once("value");
        return snapshot.val();
    } catch (error) {
        console.error("Erreur lors de la récupération du son :", error);
        throw error;
    }
};
