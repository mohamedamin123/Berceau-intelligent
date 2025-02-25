const { firestoreDb } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Assurez-vous d'importer admin

const jwt = require("jsonwebtoken");

// Reference to the "users" collection in Firestore
const usersCollection = firestoreDb.collection("users");

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const newUser = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const userRef = await usersCollection.add(newUser);
        res.status(201).json({
            message: "User created!",
            data: { id: userRef.id, ...newUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create user",
            error: error.message,
        });
    }
};

// Sign up a new user
exports.signUp = async (req, res) => {
    try {
        const newUser = {
            ...req.body,
            role: "user",
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Add a timestamp
        };
        const userRef = await usersCollection.add(newUser);
        res.status(201).json({
            message: "User signed up!",
            data: { id: userRef.id, ...newUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to sign up user",
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
            return res.status(404).json({ message: "User not found" });
        }

        await userRef.update(req.body);
        const updatedUser = (await userRef.get()).data();

        res.status(200).json({
            message: "User updated!",
            data: { id: userId, ...updatedUser },
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update user",
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
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User found successfully!",
            data: { id: userDoc.id, ...userDoc.data() },
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to find user",
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
            message: "Users found!",
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to find users",
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
            return res.status(404).json({ message: "User not found" });
        }

        await userRef.delete();
        res.status(204).json({
            message: "User deleted!",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete user",
            error: error.message,
        });
    }
};

// Sign in a user
exports.signIn = async (req, res) => {
    try {
        const emailUser = req.body.email.trim();
        const passwordUser = req.body.password.trim();

        if (!emailUser || !passwordUser) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (passwordUser.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Find user by email
        const usersSnapshot = await usersCollection.where("email", "==", emailUser).get();
        if (usersSnapshot.empty) {
            return res.status(404).json({ message: "Email or password is incorrect" });
        }

        const userDoc = usersSnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };

        // Compare passwords (assuming you have a `compairPass` method in your user model)
        if (!(await user.compairPass(passwordUser, user.password))) {
            return res.status(404).json({ message: "Email or password is incorrect" });
        }

        // Generate JWT token
        const { id, name } = user;
        const token = jwt.sign({ id, name }, process.env.SECRET_KEY, { expiresIn: "90d" });

        res.status(201).json({
            message: "Login successful!",
            token,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to sign in user",
            error: error.message,
        });
    }
};