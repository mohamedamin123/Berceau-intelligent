#importation des bib nécessaire
import machine# bib pour les gpio
import time
from Capteur import Capteur
import WiFi as WiFi
from Firebase import Firebase
import gc  # Importation du module de gestion des ordures (garbage collection)

class CapteurMVT(Capteur):
    
    def __init__(self, pin, name,etat=False):
        super().__init__(pin, name, etat)
        self.initialiser(pin,type)


    def initialiser(self, pin, type_capteur):
        print(f"Initialisation du capteur {type_capteur} sur la broche {pin}")
        self.gpio = machine.Pin(pin, machine.Pin.IN)
        self.etat=True

    def lireMVT(self):
        self.mvtDect=self.gpio.value()
        return self.mvtDect

    def envoyerDonne(self, token):
        """Envoie l'état actuel de la LED à Firebase sous le nœud 'led'."""
        try:
            # On envoie les données sous 'led' sans ID spécifique
            mvt = self.lireMVT()

            data = {
                "mvt": mvt,
            }

            Firebase.send_data("mvt", data, token)  # On passe le même endpoint 'led'
            gc.collect()
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

