import machine  # Bibliothèque pour les GPIO
import time
from Firebase import Firebase
import uasyncio as asyncio  # Bibliothèque pour gérer les tâches asynchrones
import gc  # Importation du module de gestion des ordures (garbage collection)

class Led:
    def __init__(self, pin, couleur, nbrLed, intensite, name="Led", etat=False):
        self.pin = pin
        self.name = name
        self.etat = etat
        self.couleur = couleur
        self.nbrLed = nbrLed
        self.intensite = intensite
        self.initialiser()

    def initialiser(self):
        """Initialisation de la LED sur la broche donnée."""
        self.led = machine.PWM(machine.Pin(self.pin))  # Utilisation de PWM pour contrôler l'intensité
        self.led.freq(1000)  # Fréquence de PWM standard (peut être ajustée si nécessaire)
        self.intensite = 0  # Initialisation à 0 pour éteindre la LED
        print(f"{self.name} initialisé sur la broche {self.pin} avec la couleur {self.couleur}.")

    def ajusterIntensite(self, nouv):
        """Ajuste l'intensité de la LED (0 à 1023)."""
        if 0 <= nouv <= 1023:
            self.intensite = nouv
            self.led.duty(self.intensite)  # Régler l'intensité via PWM
            print(f"{self.name} intensité ajustée à {self.intensite}.")
            if(nouv==0):
                self.etat=False
            elif(nouv>0):
                self.etat=True
        else:
            print("Intensité invalide : la valeur doit être comprise entre 0 et 1023.")

    def arreter(self):
        """Arrête la LED en mettant l'intensité à 0."""
        self.led.duty(0)  # Met le signal PWM à 0 pour éteindre la LED
        self.intensite = 0  # La LED est éteinte
        self.etat = False
        print(f"{self.name} éteinte.")

    def demarrer(self):
        self.led.duty(1023)  # Met le signal PWM à 0 pour éteindre la LED
        self.intensite = 1023  # La LED est éteinte
        self.etat = True
        print(f"{self.name} demarrer.")    


    def envoyerDonne(self, token):
        """Envoie l'état actuel de la LED à Firebase sous le nœud 'led'."""
        try:
                # On envoie les données sous 'led' sans ID spécifique
                data = {"led_etat": self.etat, "led_intensite": self.intensite}
                Firebase.send_data("led", data, token)  # On passe le même endpoint 'led'
                print(f"État envoyé à Firebase : {data}")
                gc.collect()  # Libérer la mémoire après avoir démarré la LED

        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

    def recevoirDonne(self, token):
        """Récupère l'état actuel de la LED depuis Firebase et met à jour l'intensité et l'état de la LED."""
        try:
            # Récupération des données de Firebase pour l'état de la LED
            data =  Firebase.get_data("led", token)
            #print("Données récupérées depuis Firebase :", data)  # Afficher les données récupérées
            
            if data:
                # Vérification et création des attributs si nécessaire
                if "led_etat" not in data:
                    # Si l'état de la LED n'existe pas, on l'initialise avec False (éteinte)
                    data["led_etat"] = False
                    Firebase.update_data("led", {"led_etat": False}, token)
                    print("Attribut 'led_etat' créé avec la valeur False.")
                    
                if "led_intensite" not in data:
                    # Si l'intensité de la LED n'existe pas, on l'initialise avec une valeur par défaut (par exemple 0)
                    data["led_intensite"] = 0
                    Firebase.update_data("led", {"led_intensite": 0}, token)
                    print("Attribut 'led_intensite' créé avec la valeur 0.")

                # Maintenant, on peut appliquer les données récupérées ou mises à jour
                self.etat = data["led_etat"]
                self.intensite = data["led_intensite"]
                gc.collect()  # Libérer la mémoire après avoir démarré la LED

                # Afficher les informations mises à jour
                #print(f"{self.name} état mis à jour depuis Firebase : État = {self.etat}, Intensité = {self.intensite}")
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")
