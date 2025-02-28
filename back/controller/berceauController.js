const { firestoreDb } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin
// Reference to the "Berceaus" collection in Firestore
const Berceau = require("./../model/berceauModel"); // Importation de la classe Berceau


// Reference to the "Berceaus" collection in Firestore
const BerceausCollection = firestoreDb.collection("Berceaus");

// Create a new Berceau
exports.createBerceau = async (req, res) => {
    try {
        const { prenom, dateNaissance, sexe, parentId, berceauId } = req.body;

        // Validation des données en créant une instance de Berceau
        const Berceau = new Berceau(prenom, dateNaissance, sexe, parentId, berceauId);

        // Ajouter un timestamp pour la création
        Berceau.createdAt = admin.firestore.FieldValue.serverTimestamp();

        // Enregistrer le Berceau dans Firestore
        const BerceauRef = await BerceausCollection.add(Berceau);

        // Réponse en cas de succès
        res.status(201).json({
            message: "Berceau créé !",
            data: { id: BerceauRef.id, ...Berceau },
        });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(400).json({
            message: "Impossible de créer Berceau",
            error: error.message,
        });
    }
};
// Update a Berceau (using PATCH for partial updates)
exports.updateBerceau = async (req, res) => {
    try {
        const BerceauId = req.params.id; // Récupérer l'ID du Berceau à mettre à jour
        const BerceauRef = BerceausCollection.doc(BerceauId); // Référence au document Firestore
        const BerceauDoc = await BerceauRef.get(); // Récupérer le document

        // Vérifier si le Berceau existe
        if (!BerceauDoc.exists) {
            return res.status(404).json({ message: "Berceau non trouvé" });
        }

        // Récupérer les nouvelles données du corps de la requête
        const { prenom, dateNaissance, sexe, lait, dormir,repas,couche } = req.body;

        // Créer un objet avec uniquement les champs fournis
        const updateData = {};
        if (prenom !== undefined) updateData.prenom = prenom;
        if (dateNaissance !== undefined) updateData.dateNaissance = dateNaissance;
        if (sexe !== undefined) updateData.sexe = sexe;
        if (lait !== undefined) updateData.lait = lait;
        if (dormir !== undefined) updateData.dormir = dormir;
        if (repas !== undefined) updateData.repas = repas;
        if (couche !== undefined) updateData.couche = couche;


        // Mettre à jour uniquement les champs spécifiés dans Firestore
        await BerceauRef.update(updateData);

        // Récupérer les données mises à jour
        const updatedBerceauDoc = (await BerceauRef.get()).data();

        // Réponse en cas de succès
        res.status(200).json({
            message: "Berceau mis à jour avec succès !",
            data: { id: BerceauId, ...updatedBerceauDoc },
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
        const BerceauId = req.params.id;
        const BerceauRef = BerceausCollection.doc(BerceauId);
        const BerceauDoc = await BerceauRef.get();

        if (!BerceauDoc.exists) {
            return res.status(404).json({ message: "Berceau non trouvé" });
        }

        await BerceauRef.delete();
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
        const parentId = req.params.parentId;

        // Récupérer le Berceau dont le berceauId correspond
        const BerceausSnapshot = await BerceausCollection.where("parentId", "==", parentId).get();

        if (BerceausSnapshot.empty) {
            return res.status(404).json({ message: "Aucun Berceau trouvé pour ce parent." });
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
            message: "Impossible de trouver le Berceau pour ce parent",
            error: error.message,
        });
    }
};