const { realtimeDb } = require("./../../config/firebaseConfig");

// Allumer la LED
exports.on = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/led`).set({ etat: true, intensite: 100 });
        console.log(`LED allumée pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'allumage de la LED :", error);
        throw error;
    }
};

// Éteindre la LED
exports.off = async (berceauId) => {
    try {
        await realtimeDb.ref(`berceaux/${berceauId}/led`).set({ etat: false, intensite: 0 });
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

        // Déterminer l'état en fonction de l'intensité
        const etat = intensite > 0;

        // Mettre à jour l'intensité et l'état dans Firebase
        await realtimeDb.ref(`berceaux/${berceauId}/led`).update({ intensite, etat });

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
                etat: false, // Ventilateur éteint par défaut
                intensite: 0, // Mode automatique par défaut
            };
            await ref.set(defaultData); // Enregistrer les valeurs par défaut dans Firebase
            data = defaultData; // Utiliser les valeurs par défaut pour la réponse
        }

        return data;
    }catch(error) {
        console.error("Erreur lors de la mise à jour de l'intensité de la LED :", error);
        throw error;
    }

};

