from Actionnaire import Actionnaire
import machine  # Bibliothèque pour les GPIO
import time
from Firebase import Firebase
import gc  # Importation du module de gestion des ordures (garbage collection)

class ServoMotor(Actionnaire):
    def __init__(self, pin, position=0, mode="Auto", name="Servo", etat=False):
        self.pin = pin
        self.name = name
        self.etat = etat
        self.mode = mode
        self.position = position
        self.initialiser()

    def initialiser(self):
        self.servo = machine.PWM(machine.Pin(self.pin), freq=50)
        print(f"{self.name} initialisé sur la broche {self.pin}.")


    def deplacer(self, debut=0, fin=180, pas=1, delai=0.05):
        """
        Déplace le servomoteur entre deux positions (aller-retour).

        :param debut: Position de départ en degrés (par défaut 0°).
        :param fin: Position de fin en degrés (par défaut 180°).
        :param pas: Incrément/décrément pour chaque mouvement (par défaut 1°).
        :param delai: Temps d'attente entre chaque étape (par défaut 50 ms).
        """
        try:
            # Mouvement de 0° à 180° (aller)
            for position in range(debut, fin + 1, pas):
                self._appliquer_duty(position)
                time.sleep(delai)

            # Mouvement de 180° à 0° (retour)
            for position in range(fin, debut - 1, -pas):
                self._appliquer_duty(position)
                time.sleep(delai)
        except Exception as e:
            print(f"Erreur lors du déplacement : {e}")

    def _appliquer_duty(self, position):
        """Calcule et applique le cycle de travail (duty cycle) pour la position donnée."""
        if 0 <= position <= 180:
            # Convertir la position en cycle de travail (duty cycle)
            duty = int((position / 180) * (1023 * 0.1) + (1023 * 0.05))
            self.servo.duty(duty)
            print(f"Position : {position}° (Duty Cycle : {duty})")
        else:
            raise ValueError("Position invalide : doit être comprise entre 0° et 180°.")

    def demarrer(self):
        """
        Initialise et démarre le servomoteur.
        Positionne le servomoteur à la position par défaut (0°) et active son état.
        """
        try:
            # Initialiser si ce n'est pas encore fait
            self.initialiser()
            
            # Positionner le servomoteur à la position initiale
            self._appliquer_duty(0)
            self.position = 0
            self.etat = True

            # Afficher le message de démarrage
            print(f"{self.name} démarré et positionné à {self.position}°.")
        except Exception as e:
            print(f"Erreur lors du démarrage du {self.name} : {e}")

    def arreter(self):
        self.servo.duty(0)
        self.position = 0
        self.etat = False
        print(f"{self.name} arrêté à la position {self.position}°.")

    def changeMode(self):
        self.mode = "Manuel" if self.mode == "Auto" else "Auto"
        print(f"Mode changé en {self.mode}.")

    def afficherPosition(self):
        print(f"Position actuelle de {self.name} : {self.position}°")


    def envoyerDonne(self, token):
        """Envoie l'état actuel de la LED à Firebase sous le nœud 'led'."""
        try:
            # On envoie les données sous 'led' sans ID spécifique
            data = {"servo_etat": self.etat, "servo_mode": self.mode}
            Firebase.send_data("servo", data, token)  # On passe le même endpoint 'led'
            print(f"État envoyé à Firebase : {data}")
            gc.collect()
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

    def recevoirDonne(self, token):
        """
        Récupère les données du servomoteur depuis Firebase et met à jour ses paramètres.
        """
        try:
            # Récupération des données depuis Firebase
            data = Firebase.get_data("servo", token)
            #print("Données récupérées depuis Firebase :", data)

            if data:
                # Vérifiez ou initialisez les attributs si nécessaires
                if "servo_etat" not in data:
                    data["servo_etat"] = False
                    Firebase.update_data("servo", {"servo_etat": False}, token)
                    print("Attribut 'servo_etat' créé avec la valeur False.")

                if "servo_mode" not in data:
                    data["servo_mode"] = "Auto"  # Mode par défaut
                    Firebase.update_data("servo", {"servo_mode": "Auto"}, token)
                    print("Attribut 'servo_mode' créé avec la valeur 'Auto'.")

                # Appliquer les données récupérées
                self.etat = data["servo_etat"]
                self.mode = data["servo_mode"]
                gc.collect()

                # Afficher les informations mises à jour
                #print(f"{self.name} état mis à jour depuis Firebase : État = {self.etat}, Mode = {self.mode}, Position = {self.position}")
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception de l'état  de {self.name}  depuis Firebase : {e}")
