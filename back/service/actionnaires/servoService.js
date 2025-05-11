const { realtimeDb } = require("./../../config/firebaseConfig");

exports.changeMode = async (berceauId) => {
    try {
        const snapshot = await realtimeDb.ref(`berceaux/${berceauId}/servo/mode`).once('value');
        let mode = snapshot.val();

        if (!mode) {
            mode = "automatique";
        } else {
            mode = mode === "automatique" ? "manuelle" : "automatique";
        }

        const now = new Date().toISOString(); // <<< on ajoute le time ici

        await realtimeDb.ref(`berceaux/${berceauId}/servo`).update({ 
            etat: true,
            mode: mode,
            time: now // <<< ici
        });

        console.log(`Servo marche en mode ${mode} pour berceauId: ${berceauId}`);
        return mode;
    } catch (error) {
        console.error("Erreur lors du changement de mode servo:", error);
        throw error;
    }
};

// Allumer la servo
exports.on = async (berceauId) => {
    try {
        const now = new Date().toISOString(); // <<< time ici aussi

        await realtimeDb.ref(`berceaux/${berceauId}/servo`).update({ 
            etat: true,
            time: now // <<< 
        });

        console.log(`Servo marche pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'activation de la servo :", error);
        throw error;
    }
};

// Éteindre la servo
exports.off = async (berceauId) => {
    try {
        const now = new Date().toISOString(); // <<< time

        await realtimeDb.ref(`berceaux/${berceauId}/servo`).update({ 
            etat: false,
            time: now // <<<
        });

        console.log(`Servo éteinte pour berceauId: ${berceauId}`);
    } catch (error) {
        console.error("Erreur lors de l'extinction de la servo :", error);
        throw error;
    }
};

exports.getData = async (berceauId) => {
    try {
        const ref = realtimeDb.ref(`berceaux/${berceauId}/servo`);
        const snapshot = await ref.once("value");
        let data = snapshot.val();

        if (!data) {
            const defaultData = {
                etat: false,
                mode: "automatique",
                time: new Date().toISOString(), // <<< on initialise time ici aussi
            };
            await ref.set(defaultData);
            data = defaultData;
        }

        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données de la servo :", error);
        throw error;
    }
};
