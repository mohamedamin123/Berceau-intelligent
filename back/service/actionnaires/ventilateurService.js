const { realtimeDb } = require("./../../config/firebaseConfig");

exports.changeMode = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/ventilateur/mode`).once('value');
        let mode = snapshot.val();

        if (!mode) {
            mode = "automatique";
        } else {
            mode = mode === "automatique" ? "manuelle" : "automatique";
        }

        const now = new Date().toISOString(); // <<< Ajout du time ici

        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur`).update({ 
            etat: true,
            mode: mode,
            time: now // <<< Enregistre aussi l'heure
        });

        console.log(`Ventilateur marche en mode ${mode} pour berceauId: ${berceauId}`);
        return mode;
    } catch (error) {
        console.error("Erreur lors du changement de mode du ventilateur :", error);
        throw error;
    }
};

// Allumer le ventilateur
exports.on = async (berceauId) => {
    try {
        const now = new Date().toISOString(); // <<< Ajout du time ici aussi

        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur`).update({ 
            etat: true,
            time: now
        });

        console.log(`Ventilateur marche pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'activation du ventilateur :", error);
        throw error;
    }
};

// Éteindre le ventilateur
exports.off = async (berceauId) => {
    try {
        const now = new Date().toISOString(); // <<< Ajout du time ici

        await realtimeDb.ref(`berceaux/${berceauId}/ventilateur`).update({ 
            etat: false,
            time: now
        });

        console.log(`Ventilateur éteint pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction du ventilateur :", error);
        throw error;
    }
};

exports.getData = async (berceauId) => {
    try {
        const ref = realtimeDb.ref(`berceaux/${berceauId}/ventilateur`);
        const snapshot = await ref.once("value");
        let data = snapshot.val();

        if (!data) {
            const defaultData = {
                etat: true,
                mode: "automatique",
                time: new Date().toISOString(), // <<< Ajout du time ici aussi
            };
            await ref.set(defaultData);
            data = defaultData;
        }

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données du ventilateur :", error);
        throw error;
    }
};