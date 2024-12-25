from gpiozero import DigitalInputDevice
from gpiozero import MCP3008  # Pour la lecture analogique
from Capteur import Capteur


class CapteurSon(Capteur):
    def __init__(self, pin_analogique, pin_numerique, etat=True, threshold=0.5, name="CapteurSon"):
        """
        Initialise le capteur de son avec deux broches : une pour l'analogique (via un ADC) et une pour le numérique.

        :param pin_analogique: Canal du MCP3008 utilisé pour la lecture analogique du capteur.
        :param pin_numerique: Broche GPIO utilisée pour la lecture numérique du capteur (détection de présence de son).
        :param etat: État initial du capteur (activé ou non).
        :param threshold: Seuil pour détecter le son sur la lecture analogique (entre 0.0 et 1.0).
        :param name: Nom du capteur.
        """
        super().__init__(pin_analogique, name, etat)
        self.threshold = threshold  # Seuil pour détecter le son (normalisé entre 0.0 et 1.0)
        self.pin_numerique = pin_numerique
        self.adc = None
        self.digital_sensor = None
        self.initialiser(pin_analogique, pin_numerique)

    def initialiser(self, pin_analogique, pin_numerique):
        """
        Configure les broches pour le capteur (via MCP3008 pour analogique et GPIO pour numérique).

        :param pin_analogique: Canal du MCP3008 pour la lecture analogique.
        :param pin_numerique: Broche GPIO pour la lecture numérique.
        """
        self.adc = MCP3008(channel=pin_analogique)  # Initialise le canal ADC
        self.digital_sensor = DigitalInputDevice(pin_numerique)  # Initialise la broche numérique
        self.etat = True  # Capteur activé par défaut

    def read_value_analogique(self):
        """
        Lit la valeur analogique du capteur.

        :return: Valeur normalisée (entre 0.0 et 1.0) lue par le capteur analogique.
        """
        if self.adc is None:
            raise RuntimeError("Le capteur analogique n'a pas été initialisé correctement.")
        return self.adc.value  # Renvoie une valeur entre 0.0 et 1.0

    def read_value_numerique(self):
        """
        Lit la valeur numérique du capteur (indique si un son est détecté ou non).

        :return: True si un son est détecté, sinon False.
        """
        if self.digital_sensor is None:
            raise RuntimeError("Le capteur numérique n'a pas été initialisé correctement.")
        return self.digital_sensor.value  # Renvoie 1 (son détecté) ou 0 (pas de son)

    def detect_sound_analogique(self):
        """
        Détecte si le niveau sonore dépasse le seuil en utilisant la lecture analogique.

        :return: True si le son dépasse le seuil, sinon False.
        """
        try:
            value = self.read_value_analogique()
            return value > self.threshold
        except RuntimeError as e:
            print(f"Erreur lors de la détection de son (analogique) : {e}")
            return False

    def detect_sound_numerique(self):
        """
        Détecte si un son est détecté selon la lecture numérique (présence ou absence).

        :return: True si le son est détecté, sinon False.
        """
        try:
            return self.read_value_numerique()
        except RuntimeError as e:
            print(f"Erreur lors de la détection de son (numérique) : {e}")
            return False

    def envoyerDonnee(self):
        """
        Envoie les données lues par le capteur.

        :return: Valeur analogique lue par le capteur.
        """
        try:
            return self.read_value_analogique()
        except RuntimeError as e:
            print(f"Erreur lors de l'envoi des données : {e}")
            return None
