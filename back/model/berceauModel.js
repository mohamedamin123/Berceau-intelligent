
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

        // Validation du berceauId
        if (!bebeId || typeof bebeId !== "string") {
            throw new Error("Le bebeId doit être une chaîne de caractères non vide.");
        }

        this.name=name;
        this.etat=true;
        this.parentId = parentId || null;
        this.bebeId = bebeId || null;
        
        this.created_at = new Date();
    }
}

module.exports = Berceau; // Exportation de la classe