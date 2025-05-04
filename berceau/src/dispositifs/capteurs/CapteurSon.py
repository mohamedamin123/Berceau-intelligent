from dispositifs.capteurs.Capteur import Capteur
from gpiozero import DigitalInputDevice
from time import sleep
from communication.SonAPI import SonAPI

class CapteurSon(Capteur):
    def __init__(self, pin=17): 
        self.microphone = DigitalInputDevice(pin)
        self.api = SonAPI()

    def lire_donnees(self):
        try:
            return self.microphone.value == 1
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur de son : {e}")
            return None

    def envoyer_donnees(self, berceau_id):
        valeur_son = self.lire_donnees()
        if valeur_son:
            response = self.api.save_son_data(berceau_id, valeur_son)
            print(f"DonnÃ©es envoyÃ©es : {response}")
        else:
            print("Ãchec de la lecture du capteur, donnÃ©es non envoyÃ©es.")

    def obtenir_son(self, berceau_id):
        return self.api.get_son_data(berceau_id)
