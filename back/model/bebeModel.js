const validator = require("validator");

class Bebe {
    constructor(prenom, dateNaissance, sexe, parentId, berceauId) {
        // Validation du prénom
        if (!prenom || typeof prenom !== "string" || prenom.trim().length === 0) {
            throw new Error("Le prénom doit être une chaîne de caractères non vide.");
        }

        // Validation de la date de naissance
        if (!validator.isDate(dateNaissance)) {
            throw new Error("La date de naissance doit être une date valide.");
        }

        // Validation du sexe
        if (!["M", "F"].includes(sexe)) {
            throw new Error("Le sexe doit être 'M' (masculin) ou 'F' (féminin).");
        }

        // Validation du parentId
        if (!parentId || typeof parentId !== "string") {
            throw new Error("Le parentId doit être une chaîne de caractères non vide.");
        }

        // Validation du berceauId
        if (!berceauId || typeof berceauId !== "string") {
            throw new Error("Le berceauId doit être une chaîne de caractères non vide.");
        }

        // Pas besoin de passer un ID manuellement, Firestore le générera
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.parentId = parentId;
        this.berceauId = berceauId;
    }
}

module.exports = Bebe;