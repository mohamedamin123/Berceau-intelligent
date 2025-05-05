from communication.MouvementAPI import MouvementAPI
from dispositifs.capteurs.Capteur import Capteur
from gpiozero import MotionSensor
from time import sleep

class CapteurMouvement(Capteur):
    def __init__(self, pin=5):
        self.mvt_sensor = MotionSensor(pin)
        self.api = MouvementAPI()
        self.etat_precedent = False

    def obtenir_mouvement(self, berceau_id):
        return self.api.get_mouvement_data(berceau_id)

    def lire_donnees(self):
        try:
            return self.mvt_sensor.value  # True = mouvement d�tect�
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur de mouvement : {e}")
            return None

    def envoyer_donnees(self, berceau_id):
        while True:
            mouvement = self.lire_donnees()
            print("mouvement :", mouvement)

            if mouvement and not self.etat_precedent:
                # Nouveau mouvement d�tect�
                response = self.api.save_mouvement_data(berceau_id, True)
                print(f"Donn�es envoy�es : {response}")
                self.etat_precedent = True

                sleep(10)  # Attend 10s
                response = self.api.save_mouvement_data(berceau_id, False)
                print(f"Donn�es envoy�es : {response}")
                self.etat_precedent = False

            sleep(0.1)  # Pour �viter une boucle trop rapide
