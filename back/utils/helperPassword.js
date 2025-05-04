const bcrypt = require("bcryptjs");

class HelperPassword {
    static checkPassword(pass) {
        return pass.length >= 8; // Vérifie si le mot de passe a au moins 8 caractères
    }

    static async comparePasswords(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Méthode pour hacher le mot de passe
    static async hashPassword(password) {
        if (password) {
            return await bcrypt.hash(password, 12); // Retourne le mot de passe haché
        }
        throw new Error("Password is required");
    }
}

module.exports = HelperPassword;