// services/CameraService.js

// Simulation d'une fonction pour obtenir l'état de la caméra
export const getCameraState = async (id) => {
    // Ici, tu pourrais appeler une API ou utiliser un gestionnaire d'état pour récupérer l'état actuel
    // Pour l'exemple, je vais juste retourner un objet simulé
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ active: false }); // Retourne un objet avec l'état actuel de la caméra (désactivée ici)
        }, 500);
    });
};

// Simulation d'une fonction pour basculer l'état de la caméra
export const toggleCamera = async (id, newState) => {
    // Ici, tu pourrais envoyer une requête API pour activer/désactiver la caméra
    // ou changer l'état localement
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ active: newState }); // Retourne l'état mis à jour
        }, 500);
    });
};
