import gc
from reseaux.Firebase import Firebase
from dispositifs.actionnaires import Actionnaire
from gpiozero import PWMLED  # Importation de PWMLED pour le contrôle analogique

class Lumiere:
    def __init__(self, pin, couleur, nbrLed, intensite=0, name="Led", etat=False):
        """Initialise la LED avec PWM."""
        self.pin = pin
        self.name = name
        self.etat = etat
        self.couleur = couleur
        self.nbrLed = nbrLed
        self.intensite = intensite
        self.led = None
        self.initialiser()

    def initialiser(self):
        """Initialisation de la LED sur la broche donnée en utilisant PWM."""
        self.led = PWMLED(self.pin)
        self.led.value = self.intensite  # Configure la LED à l'intensité initiale
        print(f"{self.name} initialisé sur la broche {self.pin} avec la couleur {self.couleur}.")

    def ajusterIntensite(self, nouv):
        """Ajuste l'intensité de la LED entre 0 et 1."""
        if not 0 <= nouv <= 1:
            print("Intensité invalide : la valeur doit être comprise entre 0 et 1.")
            return

        self.intensite = nouv
        self.led.value = self.intensite
        self.etat = nouv > 0  # La LED est allumée si l'intensité est > 0

    def arreter(self):
        """Arrête la LED (intensité à 0)."""
        self.led.off()
        self.intensite = 0
        self.etat = False
        print(f"{self.name} éteinte.")

    def demarrer(self):
        """Allume la LED à pleine intensité (1)."""
        self.led.on()
        self.intensite = 1
        self.etat = True
        print(f"{self.name} démarrée.")

    def envoyerDonne(self, token,chemin):
        """Envoie l'état actuel de la LED à Firebase sous le nœud 'led'."""
        try:
            # On envoie les données sous 'led' sans ID spécifique
            data = {"etat": self.etat, "intensite": self.intensite}
            Firebase.send_data(chemin, data, token)  # On passe le même endpoint 'led'

        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

    def recevoirDonne(self, token,chemin):
        """Récupère l'état actuel de la LED depuis Firebase et met à jour l'intensité et l'état de la LED."""
        try:
            # Récupération des données de Firebase pour l'état de la LED
            data = Firebase.get_data(chemin, token)

            if data:
                # Vérification et création des attributs si nécessaire
                if "etat" not in data:
                    # Si l'état de la LED n'existe pas, on l'initialise avec False (éteinte)
                    data["etat"] = False
                    Firebase.update_data("led", {"etat": False}, token)
                    print("Attribut 'etat' créé avec la valeur False.")
                    
                if "intensite" not in data:
                    # Si l'intensité de la LED n'existe pas, on l'initialise avec une valeur par défaut (par exemple 0)
                    data["led_intensite"] = 0
                    Firebase.update_data("led", {"led_intensite": 0}, token)
                    print("Attribut 'led_intensite' créé avec la valeur 0.")
                # Maintenant, on peut appliquer les données récupérées ou mises à jour
                self.etat = data["etat"]
                self.intensite = data["intensite"]/1023

                # Afficher les informations mises à jour
                #print(f"{self.name} état mis à jour depuis Firebase : État = {self.etat}, Intensité = {self.intensite}")
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")
