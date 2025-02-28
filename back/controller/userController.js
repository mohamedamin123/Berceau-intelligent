const { firestoreDb } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin
const jwt = require("jsonwebtoken");
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
// Sign up a new user
exports.signUp = async (req, res) => {
    try {
        const { email, password, ...rest } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "L'email n'est pas valide." });
        }

        if (!HelperPassword.checkPassword(password)) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
        }

        // Créer un utilisateur dans Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Hacher le mot de passe pour stockage (si nécessaire)
        const hashedPassword = await HelperPassword.hashPassword(password);

        const newUser = {
            ...rest,
            email,
            uid: userRecord.uid, // Stocker l'UID Firebase
            password: hashedPassword,
            role: "user",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Ajouter l'utilisateur dans Firestore
        await usersCollection.doc(userRecord.uid).set(newUser);

        res.status(201).json({
            message: "L'utilisateur s'est inscrit avec succès !",
            data: { id: userRecord.uid, ...newUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible d'enregistrer l'utilisateur",
            error: error.message,
        });
    }
};
// Sign in a user
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "L'email et le mot de passe sont obligatoires" });
        }

        // Récupérer l'utilisateur depuis Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);

        if (!userRecord) {
            return res.status(404).json({ message: "L'email ou le mot de passe est incorrect" });
        }

        // Récupérer l'utilisateur depuis Firestore
        const userDoc = await usersCollection.doc(userRecord.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const user = userDoc.data();

        // Comparer les mots de passe
        const isPasswordValid = await HelperPassword.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "L'email ou le mot de passe est incorrect" });
        }
        role=user.role;

        // Générer un token JWT
        const token = jwt.sign({ id: user.uid, name: user.name }, process.env.SECRET_KEY, { expiresIn: "90d" });

        res.status(200).json({
            message: "Connexion réussie !",
            token:token,
            role:role
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de se connecter",
            error: error.message,
        });
    }
};
