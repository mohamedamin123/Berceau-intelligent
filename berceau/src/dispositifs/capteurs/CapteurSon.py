from dispositifs.capteurs.Capteur import Capteur
from gpiozero import MCP3008  # Convertisseur ADC pour capteur analogique
from communication.SonAPI import SonAPI

class CapteurSon(Capteur):
    def __init__(self, channel=0):  # Canal 0 par défaut
        self.son_sensor = MCP3008(channel=channel)  # Utilisation d'un ADC
        self.api = SonAPI()

    def lire_donnees(self):
        try:
            valeur_son = self.son_sensor.value  # Lecture normalisée entre 0 et 1
            return valeur_son
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur de son : {e}")
            return None

    def envoyer_donnees(self, berceau_id):
        valeur_son = self.lire_donnees()
        if valeur_son is not None:
            response = self.api.save_son_data(berceau_id, valeur_son)
            print(f"Données envoyées : {response}")
        else:
            print("Échec de la lecture du capteur, données non envoyées.")

    def obtenir_son(self, berceau_id):
        return self.api.get_son_data(berceau_id)
