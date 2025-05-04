const { firestoreDb } = require("../config/firebaseConfig");
const Notification = require("../model/notificationModel");

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const snapshot = await firestoreDb.collection("notifications").get();
        const notifications = snapshot.docs.map(doc => {
            const data = doc.data();
            return new Notification(doc.id, data.message, data.type, data.parentId, data.berceauId);
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
    }
};

// Ajouter une notification
exports.addNotification = async (req, res) => {
    try {
        console.log("start notification : ", req.body);
        const { parentId, berceauId, message, type } = req.body;
        const newNotification = {
            parentId,
            berceauId,
            message,
            type,
            date:new Date()
        };
        const docRef = await firestoreDb.collection("notifications").add(newNotification);

        res.status(201).json({ id: docRef.id, ...newNotification });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la notification", error: error.message });
    }
};

// Trouver par parentId
exports.getNotificationsByParentId = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const snapshot = await firestoreDb.collection("notifications").where("parentId", "==", parentId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce parent" });
        }

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
    }
};

// Trouver par berceauId
exports.getNotificationsByBerceauId = async (req, res) => {
    try {
        const { id: berceauId } = req.params;
        const snapshot = await firestoreDb.collection("notifications").where("berceauId", "==", berceauId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce berceau" });
        }

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
    }
};
// Supprimer toutes les notifications par parentId
exports.deleteNotificationsByParentId = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const snapshot = await firestoreDb.collection("notifications").where("parentId", "==", parentId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce parent" });
        }

        const batch = firestoreDb.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        res.status(200).json({ message: "Toutes les notifications du parent ont été supprimées" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression des notifications", error: error.message });
    }
};
// Supprimer toutes les notifications par berceauId
exports.deleteNotificationsByBerceauId = async (req, res) => {
    try {
        const { id: berceauId } = req.params;
        const snapshot = await firestoreDb.collection("notifications").where("berceauId", "==", berceauId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce berceau" });
        }

        const batch = firestoreDb.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        res.status(200).json({ message: "Toutes les notifications du berceau ont été supprimées" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression des notifications", error: error.message });
    }
};
