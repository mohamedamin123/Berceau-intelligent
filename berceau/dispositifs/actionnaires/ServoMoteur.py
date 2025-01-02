from gpiozero import Servo
from time import sleep
from dispositifs.actionnaires import Actionnaire
from reseaux.Firebase import Firebase
import gc  # Importation du module de gestion des ordures (garbage collection)

class ServoMotor:
    def __init__(self, pin, position=0, mode="Auto", name="Servo", etat=False):
        self.pin = pin
        self.name = name
        self.etat = etat
        self.mode = mode
        self.position = position
        self.servo = Servo(self.pin, min_pulse_width=0.0005, max_pulse_width=0.0025)  # Ajustez les valeurs si nécessaire
        print(f"{self.name} initialisé sur la broche {self.pin}.")
        self.demarrer()

    def deplacer(self, debut=0, fin=180, pas=10, delai=0.05):
        """
        Déplace le servomoteur entre deux positions (aller-retour).
        :param debut: Position de départ en degrés (par défaut 0°).
        :param fin: Position de fin en degrés (par défaut 180°).
        :param pas: Incrément/décrément pour chaque mouvement (par défaut 1°).
        :param delai: Temps d'attente entre chaque étape (par défaut 50 ms).
        """
        try:
            for position in range(debut, fin + 1, pas):  # Mouvement aller
                self._appliquer_duty(position)
                sleep(delai)

            for position in range(fin, debut - 1, -pas):  # Mouvement retour
                self._appliquer_duty(position)
                sleep(delai)
        except Exception as e:
            print(f"Erreur lors du déplacement : {e}")

    def _appliquer_duty(self, position):
        """Calcule et applique le cycle de travail (duty cycle) pour la position donnée."""
        if 0 <= position <= 180:
            # Convertir la position en une valeur pour gpiozero Servo (-1.0 à 1.0)
            duty = (position / 180) * 2 - 1
            self.servo.value = duty
            self.position = position  # Mise à jour de la position interne
            print(f"Position : {position}° (Valeur du servo : {duty})")
        else:
            raise ValueError("Position invalide : doit être comprise entre 0° et 180°.")

    def demarrer(self):
        """Initialise et démarre le servomoteur."""
        try:
            self.servo.value = 0  # Valeur initiale correspondant à 0° (milieu)
            self.position = 0
            self.etat = True
            print(f"{self.name} démarré et positionné à {self.position}°.")
        except Exception as e:
            print(f"Erreur lors du démarrage du {self.name} : {e}")

    def arreter(self):
        """Arrête le servomoteur."""
        self.servo.value = None  # Désactive le signal PWM
        self.position = 0
        self.etat = False
        print(f"{self.name} arrêté à la position {self.position}°.")

    def changeMode(self):
        """Change le mode entre 'Auto' et 'Manuel'."""
        self.mode = "Manuel" if self.mode == "Auto" else "Auto"
        print(f"Mode changé en {self.mode}.")

    def afficherPosition(self):
        """Affiche la position actuelle du servomoteur."""
        print(f"Position actuelle de {self.name} : {self.position}°")

    def envoyerDonne(self, token,chemin):
        """Envoie l'état actuel du servomoteur à Firebase."""
        try:
            data = {"etat": self.etat, "mode": self.mode}
            Firebase.send_data(chemin, data, token)
            print(f"État envoyé à Firebase : {data}")
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

    def recevoirDonne(self, token,chemin):
        """Récupère les données du servomoteur depuis Firebase et met à jour ses paramètres."""
        try:
            data = Firebase.get_data(chemin, token)
            if data:
                self.etat = data["etat"]
                self.mode = data["mode"]
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")
 