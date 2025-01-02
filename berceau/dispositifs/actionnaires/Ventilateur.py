import time
from gpiozero import PWMOutputDevice
from reseaux.Firebase import Firebase


class Ventilateur:
    def __init__(self, pin: int, vitesse: float, tmp_souhaite: float, mode: str = "Automatique", name: str = "Ventilateur", etat: bool = False):
        """
        Initialise un ventilateur avec ses paramètres de configuration.

        :param pin: Numéro de la broche GPIO utilisée.
        :param vitesse: Vitesse initiale du ventilateur (0.0 à 1.0).
        :param tmp_souhaite: Température souhaitée en °C.
        :param mode: Mode de fonctionnement ("Automatique" ou "Manuelle").
        :param name: Nom du ventilateur.
        :param etat: État initial du ventilateur (allumé ou éteint).
        """
        self.pin = pin
        self.name = name
        self.etat = etat
        self.vitesse = vitesse
        self.tmp_souhaite = tmp_souhaite
        self.mode = mode
        self.ventilateur = PWMOutputDevice(pin, active_high=False)  # Utiliser PWMOutputDevice pour contrôler la vitesse
        self.vitesse_actuelle = 0.0  # État initial : éteint
        self.previous_data = None

        self.initialiser()

    def initialiser(self) -> None:
        """Initialise le ventilateur sur la broche donnée."""
        try:
            self.ventilateur.off()  # Désactive le PWM
            print(f"{self.name} initialisé sur la broche GPIO {self.pin}.")
        except Exception as e:
            print(f"Erreur lors de l'initialisation du ventilateur : {e}")

    def change_mode(self) -> None:
        """Change le mode entre 'Automatique' et 'Manuelle'."""
        self.mode = "Manuelle" if self.mode == "Automatique" else "Automatique"
        print(f"Mode changé en {self.mode}.")
        if self.mode == "Automatique":
            self.vitesse_actuelle = self.calcul_vitesse_Automatique()  # Calculer la vitesse en mode automatique
        self.modifier_vitesse(self.vitesse_actuelle)

    def regler_tmp_souhaite(self, tmp: float) -> None:
        """Règle la température souhaitée."""
        self.tmp_souhaite = tmp
        print(f"{self.name} température souhaitée réglée à {self.tmp_souhaite}°C.")
        if self.mode == "Automatique":
            self.vitesse_actuelle = self.calcul_vitesse_Automatique()  # Recalculer la vitesse en mode Automatique
            self.modifier_vitesse(self.vitesse_actuelle)

    def arreter(self):
        """Arrête le ventilateur."""
        self.vitesse_actuelle = 0.0
        self.etat = False
        self.ventilateur.off()  # Désactive le PWM

    def demarrer(self):
        
        """Allume le ventilateur."""
        self.vitesse_actuelle = 1.0  # Valeur maximale pour démarrer
        self.etat = True
        self.ventilateur.value = self.vitesse_actuelle  # Allume à pleine vitesse

    def modifier_vitesse(self, nouvelle_vitesse: float) -> None:
        """
        Modifie la vitesse du ventilateur.

        :param nouvelle_vitesse: Valeur entre 0.0 (éteint) et 1.0 (vitesse max).
        """
        if 0.0 <= nouvelle_vitesse <= 1.0:
            self.vitesse_actuelle = nouvelle_vitesse
            self.ventilateur.value = self.vitesse_actuelle  # Contrôle la vitesse avec PWM
            print(f"{self.name} vitesse modifiée à {nouvelle_vitesse}.")
        else:
            print("Erreur : La vitesse doit être comprise entre 0.0 et 1.0.")

    def calcul_vitesse_Automatique(self) -> float:
        """Calcule la vitesse en fonction de la température souhaitée en mode Automatique."""
        if self.tmp_souhaite < 20:
            return 0.2  # Faible vitesse
        elif 20 <= self.tmp_souhaite < 25:
            return 0.5  # Moyenne vitesse
        else:
            return 1.0  # Haute vitesse

    def envoyerDonne(self, token, chemin):
        """Envoie l'état actuel du ventilateur à Firebase."""
        try:
            data = {
                "etat": self.etat,
                "mode": self.mode,
                "tmpSouhaite": self.tmp_souhaite,
                "vitesse": self.vitesse_actuelle,
            }
            if data != self.previous_data:
                Firebase.send_data(chemin, data, token)
                self.previous_data = data
            else:
                print("Aucune modification à envoyer.")
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état à Firebase : {e}")

    def recevoirDonne(self, token, chemin):
        """Récupère l'état actuel du ventilateur depuis Firebase et met à jour l'état et la vitesse du ventilateur."""
        try:
            # Récupération des données depuis Firebase
            data = Firebase.get_data(chemin, token)
            if data:
                self.etat = data["etat"]
                self.mode = data["mode"]
                self.tmp_souhaite = data["tmpSouhaite"]
                self.vitesse_actuelle = data["vitesse"]

            else:
                print("Aucune donnée reçue depuis Firebase.")
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")

