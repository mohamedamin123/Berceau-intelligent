const { firestoreDb } = require('./../config/firebaseConfig');
const validator = require("validator");

class User {
    constructor(nom, prenom, email, password, role, bebes, berceauId) {
        // Validation du nom
        if (!nom || typeof nom !== "string" || nom.trim().length === 0) {
            throw new Error("Le nom doit être une chaîne de caractères non vide.");
        }

        // Validation du prénom
        if (!prenom || typeof prenom !== "string" || prenom.trim().length === 0) {
            throw new Error("Le prénom doit être une chaîne de caractères non vide.");
        }

        // Validation de l'email
        if (!validator.isEmail(email)) {
            throw new Error("L'email n'est pas valide.");
        }

        // Validation du mot de passe
        if (!validator.isStrongPassword(password, { 
            minLength: 8, 
        })) {
            throw new Error("Le mot de passe doit contenir au moins 8 caractères");
        }

        // Validation du rôle
        const rolesAutorises = ["user", "admin"]; 
        if (!rolesAutorises.includes(role)) {
            throw new Error(`Le rôle doit être l'un des suivants : ${rolesAutorises.join(", ")}.`);
        }

        // Validation de bebes (doit être un tableau si fourni)
        if (bebes && !Array.isArray(bebes)) {
            throw new Error("bebes doit être un tableau.");
        }


        // Assigner les valeurs après validation
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.role = role;
        this.bebes = bebes || []; // Par défaut, un tableau vide
        this.berceauId = berceauId || null; // Par défaut, null

        // Dates de création et de mise à jour
        this.last_password_update = new Date();
        this.created_at = new Date();
        this.uid=null;
    }

    // Static method to check if an email already exists
    static async isEmailUnique(email) {
        const usersCollection = firestoreDb.collection("users");
        const snapshot = await usersCollection.where("email", "==", email).get();
        return snapshot.empty; // Returns true if no documents match the email
    }
    static validToken = function (JWTDate) {
        // console.log(JWTDate);
        // console.log(parseInt(last.getTime() / 1000));
        return JWTDate > parseInt(this.last_password_update.getTime() / 1000);
    }
    getFullName() {
        return this.prenom + " " + this.nom;
    }


}

module.exports = User;