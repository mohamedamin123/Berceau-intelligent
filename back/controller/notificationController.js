
const { firestore } = require("../config/firebaseConfig");
const Notification = require("../model/notificationModel");

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const snapshot = await firestore.collection("notifications").get();
        const notifications = snapshot.docs.map(doc => new Notification(doc.id, ...doc.data()));
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
    }
};

// Ajouter une notification
exports.addNotification = async (req, res) => {
    try {
        const { parentId, berceauId, message, type } = req.body;
        const newNotification = { parentId, berceauId, message, date: new Date(), type };
        const docRef = await firestore.collection("notifications").add(newNotification);

        res.status(201).json({ id: docRef.id, ...newNotification });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la notification", error });
    }
};
//find by parent id

exports.getNotificationsByParentId = async (req, res) => {
    try {
        const { parentId } = req.params;
        const snapshot = await firestore.collection("notifications").where("parentId", "==", parentId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce parent" });
        }

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
    }
};
//find by berceau id
exports.getNotificationsByBerceauId = async (req, res) => {
    try {
        const { berceauId } = req.params;
        const snapshot = await firestore.collection("notifications").where("berceauId", "==", berceauId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "Aucune notification trouvée pour ce berceau" });
        }

        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
    }
};
