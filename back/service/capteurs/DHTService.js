const { realtimeDb } = require("./../../config/firebaseConfig");

// Sauvegarder les données DHT
exports.saveDHTData = async (berceauId, tmp, hmd) => {
    try {
        console.log(`berceaux/${berceauId}/dht`);
        await realtimeDb.ref(`berceaux/${berceauId}/dht`).set({ tmp, hmd });
        console.log("Données DHT enregistrées avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des données DHT :", error);
        throw error; // Propager l'erreur pour la gérer dans le contrôleur
    }
};

// Récupérer les données DHT (température et humidité)
exports.getDHTData = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/dht`).once("value");
        return snapshot.val();
    } catch (error) {
        console.error("Erreur lors de la récupération des données DHT :", error);
        throw error; // Propager l'erreur pour la gérer dans le contrôleur
    }
};

// Récupérer uniquement la température
exports.getTmp = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/dht/tmp`).once("value");
        return snapshot.val();
    } catch (error) {
        console.error("Erreur lors de la récupération de la température :", error);
        throw error; // Propager l'erreur pour la gérer dans le contrôleur
    }
};

// Récupérer uniquement l'humidité
exports.getHmd = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/dht/hmd`).once("value");
        return snapshot.val();
    } catch (error) {
        console.error("Erreur lors de la récupération de l'humidité :", error);
        throw error; // Propager l'erreur pour la gérer dans le contrôleur
    }
};