from Actionnaire import Actionnaire
import machine  # Bibliothèque pour les GPIO
import time
from Firebase import Firebase
import gc  # Importation du module de gestion des ordures (garbage collection)

class Ventilateur(Actionnaire):
    def __init__(self, pin: int, vitesse: int, tmp_souhaite: float, mode: str = "Auto", name: str = "Ventilateur", etat: bool = False):
        """
        Initialise un ventilateur avec ses paramètres de configuration.

        :param pin: Numéro de la broche utilisée.
        :param vitesse: Vitesse initiale du ventilateur (0-1023).
        :param tmp_souhaite: Température souhaitée en °C.
        :param mode: Mode de fonctionnement ("Auto" ou "Manuel").
        :param name: Nom du ventilateur.
        :param etat: État initial du ventilateur (allumé ou éteint).
        """
        self.pin = pin
        self.name = name
        self.etat = etat
        self.vitesse = vitesse
        self.tmp_souhaite = tmp_souhaite
        self.mode = mode
        self.vitesse_actuelle = 1023  # État initial : éteint
        self.initialiser()

    def initialiser(self) -> None:
        """Initialise le ventilateur sur la broche donnée."""
        try:
            self.ventilateur = machine.Pin(self.pin, machine.Pin.OUT)
            self.ventilateur.value(1)  # Assure que le ventilateur est éteint
            print(f"{self.name} initialisé sur la broche {self.pin}.")
        except Exception as e:
            print(f"Erreur lors de l'initialisation du ventilateur : {e}")

    def change_mode(self) -> None:
        """Change le mode entre 'Auto' et 'Manuel'."""
        self.mode = "Manuel" if self.mode == "Auto" else "Auto"
        print(f"Mode changé en {self.mode}.")

    def regler_tmp_souhaite(self, tmp: float) -> None:
        """Règle la température souhaitée."""
        self.tmp_souhaite = tmp
        print(f"{self.name} température souhaitée réglée à {self.tmp_souhaite}°C.")

    def arreter(self):
        """Arrête le ventilateur."""
        self.vitesse_actuelle = 1023
        self.etat = False
        self.ventilateur.value(1)
        print(f"{self.name} éteint.")

    def demarrer(self):
        """Allume le ventilateur."""
        self.vitesse_actuelle = 0
        self.etat = True
        self.ventilateur.value(0)
        print(f"{self.name} démarré.")

    def modifier_vitesse(self, nouvelle_vitesse: int) -> None:
        """
        Modifie la vitesse du ventilateur.

        :param nouvelle_vitesse: Valeur PWM entre 0 (vitesse max) et 1023 (éteint).
        """
        if 0 <= nouvelle_vitesse <= 1023:
            self.vitesse_actuelle = 1023 - nouvelle_vitesse
            print(f"{self.name} vitesse modifiée à {nouvelle_vitesse}.")
        else:
            print("Erreur : La vitesse doit être comprise entre 0 et 1023.")

    def envoyerDonne(self,token):
        """Envoie l'état actuel du ventilateur à Firebase."""
        try:
            data = {
                "ventilateur_etat": self.etat,
                "ventilateur_mode": self.mode,
                "temperature_souhaite":self.tmp_souhaite
            }
            Firebase.send_data("ventilateur", data,token)
            print(f"État envoyé à Firebase : {data}")
            gc.collect()
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état à Firebase : {e}")

    def recevoirDonne(self, token):
        """Récupère l'état actuel du ventilateur depuis Firebase et met à jour l'état et la vitesse du ventilateur."""
        try:
            # Récupération des données depuis Firebase
            data = Firebase.get_data("ventilateur", token)
            #print("Données récupérées depuis Firebase :", data)  # Afficher les données récupérées
            
            if data:
                # Vérification et création des attributs si nécessaire
                if "ventilateur_etat" not in data:
                    # Si l'état du ventilateur n'existe pas, on l'initialise avec False
                    data["ventilateur_etat"] = False
                    Firebase.update_data("ventilateur", {"ventilateur_etat": False}, token)
                    print("Attribut 'ventilateur_etat' créé avec la valeur False.")

                if "ventilateur_mode" not in data:
                    # Si le mode du ventilateur n'existe pas, on l'initialise avec "Manuel"
                    data["ventilateur_mode"] = "Manuel"
                    Firebase.update_data("ventilateur", {"ventilateur_mode": "Manuel"}, token)
                    print("Attribut 'ventilateur_mode' créé avec la valeur 'Manuel'.")
                    
                if "temperature_souhaite" not in data:
                    # Si la température souhaitée n'existe pas, on l'initialise avec une valeur par défaut (par exemple 22°C)
                    data["temperature_souhaite"] = 22
                    Firebase.update_data("ventilateur", {"temperature_souhaite": 22}, token)
                    print("Attribut 'temperature_souhaite' créé avec la valeur 22°C.")
                    
                # Vérification si la vitesse existe
                if "ventilateur_vitesse" not in data:
                    # Si la vitesse du ventilateur n'existe pas, on l'initialise avec une valeur par défaut (par exemple 1)
                    data["ventilateur_vitesse"] = 1
                    Firebase.update_data("ventilateur", {"ventilateur_vitesse": 1}, token)
                    print("Attribut 'ventilateur_vitesse' créé avec la valeur 1.")

                # Maintenant, on peut appliquer les données récupérées ou mises à jour
                self.etat = data["ventilateur_etat"]
                self.mode = data["ventilateur_mode"]
                self.tmp_souhaite = data["temperature_souhaite"]

                # Appliquer l'état du ventilateur
                if self.mode == 'Auto':
                    pass
                else:
                    if self.etat:
                        self.demarrer()  # Si l'état est vrai, on allume le ventilateur
                    else:
                        self.arreter()  # Si l'état est faux, on arrête le ventilateur

                # Appliquer la vitesse si elle est incluse dans les données
                nouvelle_vitesse = data["ventilateur_vitesse"]
                self.modifier_vitesse(nouvelle_vitesse)  # Met à jour la vitesse
                gc.collect()
                # Afficher les informations mises à jour
                #print(f"{self.name} état mis à jour depuis Firebase : État = {self.etat}, Mode = {self.mode}, Vitesse = {self.vitesse_actuelle}")
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception de l'état de {self.name} depuis Firebase : {e}")
