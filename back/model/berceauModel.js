
class Berceau {
    constructor(name, parentId, bebeId) {
        // Validation du prénom
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new Error("Le prénom doit être une chaîne de caractères non vide.");
        }
        // Validation du parentId
        if (!parentId || typeof parentId !== "string") {
            throw new Error("Le parentId doit être une chaîne de caractères non vide.");
        }
        this.name = name;
        this.etat = true;
        this.parentId = parentId || null;
        this.bebeId = bebeId || null;

        this.created_at = new Date();
    }

    toFirestore() {
        return {
            name: this.name,
            etat: this.etat,
            parentId: this.parentId,
            bebeId: this.bebeId,
            created_at: this.created_at
        };
    }
    
}
// Méthode pour convertir l'objet en un format compatible avec Firestore

module.exports = Berceau; // Exportation de la classe