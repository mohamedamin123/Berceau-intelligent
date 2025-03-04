const { firestoreDb } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin
const jwt = require("jsonwebtoken");
const HelperPassword = require("./../utils/helperPassword"); // Assurez-vous d'importer la classe HelperPassword
const validator = require("validator"); // Ajoutez cette ligne

// Reference to the "users" collection in Firestore
const usersCollection = firestoreDb.collection("users");


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
            last_password_update: new Date(),

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
