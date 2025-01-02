import gc
from reseaux.Firebase import Firebase
from dispositifs.actionnaires import Actionnaire
from gpiozero import PWMLED  # Importation de PWMLED pour le contrôle analogique

class Berceau:
    def __init__(self,id,nom,etat):
        """Initialise la LED avec PWM."""
        self.id = id
        self.name = nom
        self.etat = etat
       

    def recevoirDonne(self, token,chemin):
        """Récupère l'état actuel de la LED depuis Firebase et met à jour l'intensité et l'état de la LED."""
        try:
            # Récupération des données de Firebase pour l'état de la LED
            data = Firebase.get_data(chemin, token)
            print(f"Données reçues depuis Firebase : {data}")
            if data:
                # Maintenant, on peut appliquer les données récupérées ou mises à jour
                self.etat = data["etat"]
                self.id = data["id"]

                # Afficher les informations mises à jour
                print(f"{self.name} état mis à jour depuis Firebase : État = {self.etat}")
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")
