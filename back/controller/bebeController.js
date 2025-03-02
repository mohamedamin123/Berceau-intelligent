const { firestoreDb } = require("../config/firebaseConfig");
// Reference to the "Bebes" collection in Firestore
const Bebe = require("./../model/bebeModel"); // Importation de la classe Bebe


// Reference to the "Bebes" collection in Firestore
const BebesCollection = firestoreDb.collection("bebes");

// Create a new Bebe
exports.createBebe = async (req, res) => {
    try {
        const { prenom, dateNaissance, sexe, parentId, berceauId } = req.body;

        // Validation des données en créant une instance de Bebe
        const bebe = new Bebe(prenom, dateNaissance, sexe, parentId, berceauId);

        // Ajouter un timestamp pour la création
        const dataToSave = bebe.toFirestore();

        // Enregistrer le bébé dans Firestore
        const bebeRef = await BebesCollection.add(dataToSave);

        // Réponse en cas de succès
        res.status(201).json({
            message: "Bébé créé !",
            data: { id: bebeRef.id, ...bebe },
        });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(400).json({
            message: "Impossible de créer bébé",
            error: error.message,
        });
    }
};
// Update a Bebe (using PATCH for partial updates)
exports.updateBebe = async (req, res) => {
    try {
        const bebeId = req.params.id; // Récupérer l'ID du bébé à mettre à jour
        const bebeRef = BebesCollection.doc(bebeId); // Référence au document Firestore
        const bebeDoc = await bebeRef.get(); // Récupérer le document

        // Vérifier si le bébé existe
        if (!bebeDoc.exists) {
            return res.status(404).json({ message: "Bébé non trouvé" });
        }

        // Récupérer les nouvelles données du corps de la requête
        const { prenom, dateNaissance, sexe, lait, dormir,repas,couche,berceauId } = req.body;

        // Créer un objet avec uniquement les champs fournis
        const updateData = {};
        if (prenom !== undefined) updateData.prenom = prenom;
        if (dateNaissance !== undefined) updateData.dateNaissance = dateNaissance;
        if (sexe !== undefined) updateData.sexe = sexe;
        if (lait !== undefined) updateData.lait = lait;
        if (dormir !== undefined) updateData.dormir = dormir;
        if (repas !== undefined) updateData.repas = repas;
        if (couche !== undefined) updateData.couche = couche;
        if (berceauId !== undefined) updateData.berceauId = berceauId;



        // Mettre à jour uniquement les champs spécifiés dans Firestore
        await bebeRef.update(updateData);

        // Récupérer les données mises à jour
        const updatedBebeDoc = (await bebeRef.get()).data();

        // Réponse en cas de succès
        res.status(200).json({
            message: "Bébé mis à jour avec succès !",
            data: { id: bebeId, ...updatedBebeDoc },
        });
    } catch (error) {
        // Réponse en cas d'erreur
        res.status(400).json({
            message: "Échec de la mise à jour du bébé",
            error: error.message,
        });
    }
};
// Get a Bebe by ID
exports.getBebe = async (req, res) => {
    try {
        const bebeId = req.params.id;
        const bebeDoc = await BebesCollection.doc(bebeId).get();

        if (!bebeDoc.exists) {
            return res.status(404).json({ message: "Bébé non trouvé" });
        }

        res.status(200).json({
            message: "Bébé retrouvé avec succès !",
            data: { id: bebeDoc.id, ...bebeDoc.data() },
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver Bebe",
            error: error.message,
        });
    }
};
// Get all Bebes
exports.getAllBebe = async (req, res) => {
    try {
        const bebesSnapshot = await BebesCollection.get();
        const bebes = [];
        bebesSnapshot.forEach((doc) => {
            bebes.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            message: "Bébés trouvés !",
            data: bebes,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver Bebes",
            error: error.message,
        });
    }
};
// Delete a Bebe
exports.deleteBebe = async (req, res) => {
    try {
        const bebeId = req.params.id;
        const bebeRef = BebesCollection.doc(bebeId);
        const bebeDoc = await bebeRef.get();

        if (!bebeDoc.exists) {
            return res.status(404).json({ message: "Bébé non trouvé" });
        }

        await bebeRef.delete();
        res.status(204).json({
            message: "Bébé supprimé !",
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de supprimer Bebe",
            error: error.message,
        });
    }
};
// Find Bebes by Parent ID
exports.findBebesByIdParent = async (req, res) => {
    try {
        const parentId = req.params.parentId;

        // Récupérer tous les bébés dont le parentId correspond
        const bebesSnapshot = await BebesCollection.where("parentId", "==", parentId).get();

        const bebes = [];
        bebesSnapshot.forEach((doc) => {
            bebes.push({ id: doc.id, ...doc.data() });
        });

        if (bebes.length === 0) {
            return res.status(404).json({ message: "Aucun bébé trouvé pour ce parent." });
        }

        res.status(200).json({
            message: "Bébés trouvés !",
            data: bebes,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver les bébés pour ce parent",
            error: error.message,
        });
    }
};
// Find Bebe by Berceau ID 
exports.findBebeByIdBerceau = async (req, res) => {
    try {
        const berceauId = req.params.berceauId;

        // Récupérer le bébé dont le berceauId correspond
        const bebesSnapshot = await BebesCollection.where("berceauId", "==", berceauId).get();

        if (bebesSnapshot.empty) {
            return res.status(404).json({ message: "Aucun bébé trouvé pour ce berceau." });
        }

        // Puisqu'il ne peut y avoir qu'un seul bébé par berceau, on prend le premier document
        const bebeDoc = bebesSnapshot.docs[0];
        const bebe = { id: bebeDoc.id, ...bebeDoc.data() };

        res.status(200).json({
            message: "Bébé trouvé !",
            data: bebe,
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de trouver le bébé pour ce berceau",
            error: error.message,
        });
    }
};