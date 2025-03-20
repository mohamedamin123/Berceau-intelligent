const { firestoreDb } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin
const HelperPassword = require("./../utils/helperPassword"); // Assurez-vous d'importer la classe HelperPassword
const User = require("./../model/userModel"); // Importation de la classe User
const validator = require("validator"); // Ajoutez cette ligne

// Reference to the "users" collection in Firestore
const usersCollection = firestoreDb.collection("users");

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;

        // Valider l'email
        if (!validator.isEmail(rest.email)) {
            return res.status(400).json({ message: "L'email n'est pas valide." });
        }

        // Vérifier si l'email est unique
        const isEmailUnique = await User.isEmailUnique(rest.email);
        if (!isEmailUnique) {
            return res.status(400).json({ message: "L'email existe déjà" });
        }

        // Hacher le mot de passe
        const hashedPassword = await HelperPassword.hashPassword(password);

        const newUser = {
            ...rest,
            password: hashedPassword,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            last_password_update: new Date(),

        };

        const userRef = await usersCollection.add(newUser);
        res.status(201).json({
            message: "utilisateur créé avec succès!",
            data: { id: userRef.id, ...newUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Échec de la création de l'utilisateur",
            error: error.message,
        });
    }
};
// Update a user
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = usersCollection.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const { password, ...rest } = req.body;

        let updateData = { ...rest };

        // Si le mot de passe est fourni, le hacher avant de mettre à jour
        if (password) {
            const hashedPassword = await HelperPassword.hashPassword(password);
            updateData.password = hashedPassword;
        }

        await userRef.update(updateData);
        const updatedUser = (await userRef.get()).data();

        res.status(200).json({
            message: "utilisateur mise à jour avec succès",
            data: { id: userId, ...updatedUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Échec de la mise à jour de l'utilisateur",
            error: error.message,
        });
    }
};
// Get a user by ID
exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDoc = await usersCollection.doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            message: "Utilisateur trouvé avec succès !",
            data: { id: userDoc.id, ...userDoc.data() },
        });
    } catch (error) {
        res.status(400).json({
            message: "Échec de trouver l'utilisateur",
            error: error.message,
        });
    }
};
// Get all users
exports.getAllUser = async (req, res) => {
    try {
        const usersSnapshot = await usersCollection.get();
        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            message: "Utilisateurs trouvés !",
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            message: "Échec de trouver l'utilisateurs",
            error: error.message,
        });
    }
};
// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = usersCollection.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const userData = userDoc.data();
        const uid = userData.uid; // Récupérer l'UID Firebase

        if (!uid) {
            return res.status(400).json({ message: "UID utilisateur introuvable, impossible de supprimer de l'authentification." });
        }

        // Supprimer l'utilisateur de Firebase Authentication
        await admin.auth().deleteUser(uid);

        // Supprimer l'utilisateur de Firestore
        await userRef.delete();

        res.status(200).json({
            message: "Utilisateur supprimé avec succès de Firestore et de Firebase Authentication !",
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de supprimer l'utilisateur",
            error: error.message,
        });
    }
};
// Get a user by email
exports.getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;

        // Valider l'email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "L'email n'est pas valide." });
        }

        // Chercher l'utilisateur par email dans la collection "users"
        const userSnapshot = await usersCollection.where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet email." });
        }

        // Utilisateur trouvé
        const user = userSnapshot.docs[0].data();
        res.status(200).json({
            message: "Utilisateur trouvé avec succès !",
            data: { id: userSnapshot.docs[0].id, ...user },
        });
    } catch (error) {
        res.status(400).json({
            message: "Erreur lors de la recherche de l'utilisateur",
            error: error.message,
        });
    }
};

