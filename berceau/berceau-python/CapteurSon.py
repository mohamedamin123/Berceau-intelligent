from Capteur import Capteur
from machine import ADC, Pin
import time

class CapteurSon(Capteur):
    def __init__(self, pin_analogique, pin_numerique, etat=True, threshold=500, name="CapteurSon"):
        """
        Initialise le capteur de son avec deux broches : une pour l'analogique et une pour le numérique.

        :param pin_analogique: Broche utilisée pour la lecture analogique du capteur.
        :param pin_numerique: Broche utilisée pour la lecture numérique du capteur (détection de présence de son).
        :param etat: État initial du capteur (activé ou non).
        :param threshold: Seuil pour détecter le son sur la broche analogique.
        :param name: Nom du capteur.
        """
        # Appel du constructeur de la classe parent
        super().__init__(pin_analogique, name, etat)
        self.threshold = threshold  # Seuil pour détecter le son
        self.pin_analogique = pin_analogique
        self.pin_numerique = pin_numerique
        self.adc = None  # Initialisation de l'attribut ADC
        self.initialiser(pin_analogique, pin_numerique)
    
    def initialiser(self, pin_analogique, pin_numerique):
        """
        Configure les broches pour le capteur (une pour le mode analogique et une pour le numérique).

        :param pin_analogique: Broche pour la lecture analogique.
        :param pin_numerique: Broche pour la lecture numérique.
        """
        self.adc = ADC(Pin(pin_analogique))  # Broche en mode ADC
        self.adc.atten(ADC.ATTN_11DB)  # Plage de 0-3.3V pour le capteur analogique
        self.pin_numerique = Pin(pin_numerique, Pin.IN)  # Broche numérique pour détecter si le son est présent
        self.etat = True  # Activation par défaut

    def read_value_analogique(self):
        """
        Lit la valeur analogique du capteur.

        :return: Valeur lue par le capteur analogique (entre 0 et 4095).
        """
        if self.adc is None:
            raise RuntimeError("Le capteur n'a pas été initialisé correctement.")
        return self.adc.read()

    def read_value_numerique(self):
        """
        Lit la valeur numérique du capteur (indique si un son est détecté ou non).

        :return: True si un son est détecté, sinon False.
        """
        return self.pin_numerique.value()  # Retourne l'état numérique (0 ou 1)

    def detect_sound_analogique(self):
        """
        Détecte si le niveau sonore dépasse le seuil en utilisant la lecture analogique.

        :return: True si le son dépasse le seuil, sinon False.
        """
        try:
            value = self.read_value_analogique()
            return value > self.threshold
        except RuntimeError as e:
            print(f"Erreur lors de la détection de son : {e}")
            return False

    def detect_sound_numerique(self):
        """
        Détecte si un son est détecté selon la lecture numérique (présence ou absence).

        :return: True si le son est détecté, sinon False.
        """
        return self.read_value_numerique()

    def envoyerDonnee(self):
        """
        Envoie les données lues par le capteur.

        :return: Valeur analogique lue par le capteur.
        """
        return self.read_value_analogique()
