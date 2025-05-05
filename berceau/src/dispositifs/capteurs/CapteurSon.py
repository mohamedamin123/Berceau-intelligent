from dispositifs.capteurs.Capteur import Capteur
from gpiozero import DigitalInputDevice
from time import sleep
from communication.SonAPI import SonAPI

class CapteurSon(Capteur):
    def __init__(self, pin=17): 
        self.microphone = DigitalInputDevice(pin)
        self.api = SonAPI()
        self.etat_precedent = False

    def lire_donnees(self):
        try:
            
            return self.microphone.value == 1
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur de son : {e}")
            return None

    def envoyer_donnees(self, berceau_id):
        while True:
            valeur_son = self.lire_donnees()
            if valeur_son and not self.etat_precedent:
                # Changement d'�tat de silence � bruit
                response = self.api.save_son_data(berceau_id, True)
                print(f"Donn�es envoy�es : {response}")
                self.etat_precedent = True
                sleep(10)  # Attend 10 secondes
                # Ensuite, envoie l'�tat "faux"
                response = self.api.save_son_data(berceau_id, False)
                print(f"Donn�es envoy�es : {response}")
                self.etat_precedent = False

            sleep(0.1)  # petite pause pour �viter boucle trop rapide

    def obtenir_son(self, berceau_id):
        return self.api.get_son_data(berceau_id)
