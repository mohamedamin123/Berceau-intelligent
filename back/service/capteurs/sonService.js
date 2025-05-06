const { realtimeDb } = require("./../../config/firebaseConfig");

// Méthode pour mettre à jour uniquement le champ "mouvement"
exports.saveSon = async (berceauId, son) => {
    try {
        // Exemple attendu de "son" : { etat: true, type: "pleure" }
        await realtimeDb.ref(`berceaux/${berceauId}/son`).set({
            etat: !!son.etat,   // forcé en booléen
            type: son.type || ""
        });
        console.log(`son mis à jour pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du son :", error);
        throw error;
    }
};


exports.getSon = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/son`).once("value");
        return snapshot.val();  // ex: { etat: true, type: "pleure" }
    } catch (error) {
        console.error("Erreur lors de la récupération du son :", error);
        throw error;
    }
};
