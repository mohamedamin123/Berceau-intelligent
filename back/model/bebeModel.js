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

        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.repas = "";
        this.couche = "";
        this.lait = "";
        this.dormir = "";
        this.parentId = parentId || null;
        this.berceauId = berceauId || null;
        this.created_at = new Date();
    }

    // Méthode pour convertir l'objet en un format compatible avec Firestore
    toFirestore() {
        return {
            prenom: this.prenom,
            dateNaissance: this.dateNaissance,
            sexe: this.sexe,
            repas: this.repas,
            couche: this.couche,
            lait: this.lait,
            dormir: this.dormir,
            parentId: this.parentId,
            berceauId: this.berceauId,
            created_at: this.created_at
        };
    }
}

module.exports = Bebe; // Exportation de la classe
