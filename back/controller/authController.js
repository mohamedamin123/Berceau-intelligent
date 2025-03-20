const { firestoreDb} = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin
const jwt = require("jsonwebtoken");
const HelperPassword = require("./../utils/helperPassword"); // Assurez-vous d'importer la classe HelperPassword
const validator = require("validator"); // Ajoutez cette ligne
const HelperEmail = require("./../utils/helperEmail"); // Assurez-vous d'importer la classe HelperPassword


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
        role = user.role;

        // Générer un token JWT
        const token = jwt.sign({ id: user.uid, name: user.name }, process.env.SECRET_KEY, { expiresIn: "90d" });

        res.status(200).json({
            message: "Connexion réussie !",
            token: token,
            user: { id: user.uid, email: user.email } // On exclut les infos sensibles
        });
    } catch (error) {
        res.status(400).json({
            message: "Impossible de se connecter",
            error: error.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Veuillez fournir un email valide" });
        }

        // Vérifier si l'utilisateur existe dans Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);
        if (!userRecord) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
        }

        // Générer un code de réinitialisation à 6 chiffres
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Définir un délai d'expiration de 10 minutes (600 secondes)
        const expirationTime = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 600 * 1000));

        // Enregistrer le code de réinitialisation et son expiration dans Firestore
        await usersCollection.doc(userRecord.uid).update({
            resetCode,
            resetCodeExpiration: expirationTime
        });

        HelperEmail.sendEmail(email,resetCode);
        res.status(200).json({ message: "Un email de réinitialisation a été envoyé." });


    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe", error.message);

        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ message: "Utilisateur non trouvé avec cet email" });
        } else {
            res.status(400).json({
                message: "Erreur lors de la réinitialisation du mot de passe",
                error: error.message
            });
        }
    }
};

exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email et code sont requis." });
        }

        // Trouver l'utilisateur par email
        const userRecord = await admin.auth().getUserByEmail(email);
        if (!userRecord) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const userDoc = await usersCollection.doc(userRecord.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const userData = userDoc.data();

        // Vérifier si le code est correct et s'il n'a pas expiré
        if (userData.resetCode !== code) {
            return res.status(400).json({ message: "Code invalide." });
        }

        const expirationTime = userData.resetCodeExpiration.toDate();
        if (new Date() > expirationTime) {
            return res.status(400).json({ message: "Le code a expiré." });
        }

        res.status(200).json({ message: "Code valide !" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la vérification du code.", error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { email, newPassword, code } = req.body;

        if (!email || !newPassword || !code) {
            return res.status(400).json({ message: "Email, code et nouveau mot de passe sont requis." });
        }

        if (!HelperPassword.checkPassword(newPassword)) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
        }

        // Vérifier si l'utilisateur existe
        const userRecord = await admin.auth().getUserByEmail(email);
        if (!userRecord) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const userDoc = await usersCollection.doc(userRecord.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const userData = userDoc.data();

        // Vérifier le code et son expiration
        if (userData.resetCode !== code) {
            return res.status(400).json({ message: "Code invalide." });
        }

        const expirationTime = userData.resetCodeExpiration.toDate();
        if (new Date() > expirationTime) {
            return res.status(400).json({ message: "Le code a expiré." });
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await HelperPassword.hashPassword(newPassword);

        // Mettre à jour le mot de passe dans Firebase Authentication
        await admin.auth().updateUser(userRecord.uid, { password: newPassword });

        // Mettre à jour le mot de passe dans Firestore
        await usersCollection.doc(userRecord.uid).update({
            password: hashedPassword,
            last_password_update: new Date(),
            resetCode: null,  // Supprimer le code après mise à jour
            resetCodeExpiration: null
        });

        res.status(200).json({ message: "Mot de passe mis à jour avec succès !" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe.", error: error.message });
    }
};
