const { firestoreDb,realtimeDb } = require("../config/firebaseConfig");
// Reference to the "Berceaus" collection in Firestore
const Berceau = require("./../model/berceauModel"); // Importation de la classe Berceau


// Reference to the "Berceaus" collection in Firestore
const BerceausCollection = firestoreDb.collection("Berceaux");

exports.createBerceau = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        // Validation des données en créant une instance de Berceau
        const berceau = new Berceau(name, parentId);

        // Ajouter un timestamp pour la création
        const dataToSave = berceau.toFirestore();

        // Enregistrer le Berceau dans Firestore
        const berceauRef = await BerceausCollection.add(dataToSave);

        // Réponse en cas de succès
        res.status(201).json({
            message: "Berceau créé !",
            data: { id: berceauRef.id, ...dataToSave },
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de créer Berceau",
            error: error.message,
        });
    }
};
// Mettre à jour un Berceau
exports.updateBerceau = async (req, res) => {
    try {
        const berceauId = req.params.id; // Récupérer l'ID du berceau à mettre à jour
        const berceauRef = firestoreDb.collection('Berceaux').doc(berceauId); // Référence au document du berceau
        const berceauDoc = await berceauRef.get(); // Récupérer le document du berceau

        // Vérifier si le berceau existe
        if (!berceauDoc.exists) {
            return res.status(404).json({ message: "Berceau non trouvé" });
        }

        // Récupérer les nouvelles données du corps de la requête
        const { name, bebeId } = req.body;

        // Créer un objet avec uniquement les champs fournis
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bebeId !== undefined) updateData.bebeId = bebeId;

        // Vérifier que updateData contient au moins un champ
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Aucune donnée à mettre à jour",
            });
        }

        // Mettre à jour uniquement les champs spécifiés dans Firestore
        await berceauRef.update(updateData);

        // Récupérer les données mises à jour
        const updatedBerceauDoc = (await berceauRef.get()).data();

        // Réponse en cas de succès
        res.status(200).json({
            message: "Berceau mis à jour avec succès !",
            data: { id: berceauId, ...updatedBerceauDoc },
        });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(400).json({
            message: "Échec de la mise à jour du Berceau",
            error: error.message,
        });
    }
};
// Get a Berceau by ID
exports.getBerceau = async (req, res) => {
    try {
        const BerceauId = req.params.id;
        const BerceauDoc = await BerceausCollection.doc(BerceauId).get();

        if (!BerceauDoc.exists) {
            return res.status(404).json({ message: "Berceau non trouvé" });
        }

        res.status(200).json({
            message: "Berceau retrouvé avec succès !",
            data: { id: BerceauDoc.id, ...BerceauDoc.data() },
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver Berceau",
            error: error.message,
        });
    }
};
// Get all Berceaus
exports.getAllBerceau = async (req, res) => {
    try {
        const BerceausSnapshot = await BerceausCollection.get();
        const Berceaus = [];
        BerceausSnapshot.forEach((doc) => {
            Berceaus.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            message: "Berceaus trouvés !",
            data: Berceaus,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver Berceaus",
            error: error.message,
        });
    }
};
// Delete a Berceau
exports.deleteBerceau = async (req, res) => {
    try {
        const berceauId = req.params.id;
        const berceauRef = BerceausCollection.doc(berceauId);
        const berceauDoc = await berceauRef.get();

        if (!berceauDoc.exists) {
            return res.status(404).json({ message: "Berceau non trouvé" });
        }

        // Vérifier l'existence de la donnée dans Realtime Database
        const realtimeRef = realtimeDb.ref(`berceaux/${berceauId}`);
        const snapshot = await realtimeRef.once('value');

        if (snapshot.exists()) {
            await realtimeRef.remove();
            console.log("Donnée RealtimeDB supprimée");
        } else {
            console.log("Aucune donnée à supprimer dans RealtimeDB");
        }

        // Supprimer le document Firestore
        await berceauRef.delete();

        res.status(204).json({
            message: "Berceau supprimé !",
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de supprimer Berceau",
            error: error.message,
        });
    }
};

// Find Berceau by bebe ID 
exports.findBerceauByIdBebe = async (req, res) => {
    try {
        const bebeId = req.params.bebeId;

        // Récupérer le Berceau dont le berceauId correspond
        const BerceausSnapshot = await BerceausCollection.where("bebeId", "==", bebeId).get();

        if (BerceausSnapshot.empty) {
            return res.status(404).json({ message: "Aucun Berceau trouvé pour ce bebe." });
        }

        // Puisqu'il ne peut y avoir qu'un seul Berceau par berceau, on prend le premier document
        const BerceauDoc = BerceausSnapshot.docs[0];
        const Berceau = { id: BerceauDoc.id, ...BerceauDoc.data() };

        res.status(200).json({
            message: "Berceau trouvé !",
            data: Berceau,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver le Berceau pour ce bebe",
            error: error.message,
        });
    }
};
// Find Berceau by parent ID 
exports.findBerceauByIdParent = async (req, res) => {
    try {
        const parentId = req.params.id;

        // Récupérer tous les Berceaux dont le parentId correspond
        const BerceausSnapshot = await BerceausCollection.where("parentId", "==", parentId).get();

        if (BerceausSnapshot.empty) {
            return res.status(404).json({ message: "Aucun Berceau trouvé pour ce parent." });
        }

        // Construire un tableau des berceaux avec leurs données
        const Berceaux = BerceausSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({
            message: "Berceaux trouvés !",
            data: Berceaux,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver les Berceaux pour ce parent",
            error: error.message,
        });
    }
};
