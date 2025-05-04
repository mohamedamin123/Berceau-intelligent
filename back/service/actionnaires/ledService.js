const { realtimeDb } = require("./../../config/firebaseConfig");

// Fonction pour obtenir la date actuelle en format ISO
const getCurrentTime = () => {
    return new Date().toISOString(); // Exemple : "2025-04-27T12:34:56.789Z"
};

// Allumer la LED
exports.on = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/led`).set({ 
            etat: true, 
            intensite: 100, 
            time: getCurrentTime() 
        });
        console.log(`LED allumée pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'allumage de la LED :", error);
        throw error;
    }
};

// Éteindre la LED
exports.off = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/led`).set({ 
            etat: false, 
            intensite: 0, 
            time: getCurrentTime() 
        });
        console.log(`LED éteinte pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la LED :", error);
        throw error;
    }
};

// Changer l'intensité de la LED et ajuster automatiquement l'état
exports.changeIntensity = async (berceauId, intensite) => {
    try {
        if (intensite < 0 || intensite > 100) {
            throw new Error("L'intensité doit être comprise entre 0 et 100.");
        }

        const etat = intensite > 0;

        await realtimeDb.ref(`berceaux/${berceauId}/led`).update({ 
            intensite, 
            etat,
            time: getCurrentTime()
        });

        console.log(`LED mise à jour pour berceauId: ${berceauId} -> Intensité: ${intensite}%, État: ${etat}`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'intensité de la LED :", error);
        throw error;
    }
};

// Obtenir l'état et l'intensité de la LED
exports.getData = async (berceauId) => {
    try {
        const ref = realtimeDb.ref(`berceaux/${berceauId}/led`);
        const snapshot = await ref.once("value");
        let data = snapshot.val();

        // Si les données n'existent pas, initialiser les valeurs par défaut
        if (!data) {
            const defaultData = {
                etat: false,
                intensite: 0,
                time: getCurrentTime()
            };
            await ref.set(defaultData);
            data = defaultData;
        }

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données de la LED :", error);
        throw error;
    }
};
