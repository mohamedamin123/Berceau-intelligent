from communication.VentilateurAPI import VentilateurAPI
from dispositifs.actionnaires.Actionnaire import Actionnaire
from gpiozero import OutputDevice  # Utilisation d'un Ventilateur comme sortie numérique

class ActionneurVentilateur(Actionnaire):
    def __init__(self, pin=16):  # GPIO 18 par défaut
        self.relay = OutputDevice(pin, active_high=True, initial_value=False)  # Le Ventilateur est activé à True
        self.api = VentilateurAPI()

    def allumer(self, berceau_id):
        self.relay.off()  # Active le Ventilateur (ferme le circuit)
        response = self.api.turn_on(berceau_id)
        print(f"Ventilateur activé : {response}")

    def eteindre(self, berceau_id):
        self.relay.on()  # Désactive le Ventilateur (ouvre le circuit)
        response = self.api.turn_off(berceau_id)
        print(f"Ventilateur désactivé : {response}")

    def obtenir_statut(self, berceau_id):
        statut= self.api.get_status(berceau_id)
        etat=statut["etat"]
        mode=statut["mode"]
        return mode,etat
    
    def changer_mode(self, berceau_id):
        # Vous pouvez ajouter un contrôle spécifique du Ventilateur pour changer le mode si nécessaire
        response = self.api.change_mode(berceau_id)
        print(f"Mode du Ventilateur changé : {response}")
