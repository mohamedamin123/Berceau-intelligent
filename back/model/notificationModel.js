class Notification {
    constructor(message, type, parentId, berceauId) {

        if (!message || typeof message !== "string" || nomessagem.trim().length === 0) {
            throw new Error("Le message doit être une chaîne de caractères non vide.");
        }

        if (!type || typeof type !== "string" || type.trim().length === 0) {
            throw new Error("Le type doit être une chaîne de caractères non vide.");
        }


        this.message = message;
        this.date = new Date();
        this.type = type;
        this.parentId = parentId;
        this.berceauId = berceauId;
    }
}

module.exports = Notification;