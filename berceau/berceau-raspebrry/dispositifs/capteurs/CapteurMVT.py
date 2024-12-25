from gpiozero import MotionSensor  # Pour les capteurs de mouvement
import time
from Capteur import Capteur
import gc

from reseaux.Firebase import Firebase  # Gestion des ordures (garbage collection)


class CapteurMVT(Capteur):
    
    def __init__(self, pin, name, etat=False, type_capteur="Capteur de mouvement"):
        """
        Initialise un capteur de mouvement.

        :param pin: Broche GPIO utilisée pour connecter le capteur.
        :param name: Nom du capteur.
        :param etat: État initial du capteur (activé ou désactivé).
        :param type_capteur: Type de capteur (par défaut : "Capteur de mouvement").
        """
        super().__init__(pin, name, etat)
        self.initialiser(pin, type_capteur)

    def initialiser(self, pin, type_capteur):
        """
        Initialise le capteur de mouvement sur une broche donnée.

        :param pin: Broche GPIO utilisée.
        :param type_capteur: Type du capteur.
        """
        print(f"Initialisation du capteur {type_capteur} sur la broche {pin}.")
        self.sensor = MotionSensor(pin)
        self.etat = True

    def lireMVT(self):
        """
        Lit l'état du capteur de mouvement.

        :return: True si un mouvement est détecté, False sinon.
        """
        return self.sensor.motion_detected

    def envoyerDonne(self, token):
        """
        Envoie les données de mouvement à Firebase.

        :param token: Token d'authentification pour Firebase.
        """
        try:
            mvt = self.lireMVT()
            data = {"mvt": mvt}

            # Envoi des données à Firebase
            Firebase.send_data("mvt", data, token)

            # Gestion de la mémoire
            gc.collect()
            print(f"Données envoyées : {data}")
        except Exception as e:
            print(f"Erreur lors de l'envoi des données : {e}")
