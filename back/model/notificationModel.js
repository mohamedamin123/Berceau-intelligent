class Notification {
    constructor(parentId, berceauId, message, type) {
        if (!message || typeof message !== "string" || message.trim().length === 0) { 
            throw new Error("Le message doit être une chaîne de caractères non vide.");
        }

        if (!type || typeof type !== "string" || type.trim().length === 0) {
            throw new Error("Le type doit être une chaîne de caractères non vide.");
        }

        this.message = message;
        this.date = new Date(); // Tu peux aussi utiliser `Timestamp.now()` de Firestore si tu veux une date serveur
        this.type = type;
        this.parentId = parentId;
        this.berceauId = berceauId;
    }
}

module.exports = Notification;
