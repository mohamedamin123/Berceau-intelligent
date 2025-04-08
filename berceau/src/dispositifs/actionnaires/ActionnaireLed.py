from communication.LedAPI import LedAPI
from dispositifs.actionnaires.Actionnaire import Actionnaire
from gpiozero import PWMLED

class ActionneurLED(Actionnaire):
    def __init__(self, pin=19):  # GPIO 17 par défaut
        self.led = PWMLED(pin)
        self.api = LedAPI()

    def allumer(self, berceau_id):
        self.led.on()
        response = self.api.turn_on(berceau_id)
        print(f"LED allumée : {response}")

    def eteindre(self, berceau_id):
        self.led.off()
        response = self.api.turn_off(berceau_id)
        print(f"LED éteinte : {response}")

    def obtenir_statut(self, berceau_id):
        statut= self.api.get_status(berceau_id)
        etat=statut["etat"]
        intensite=statut["intensite"]
        return intensite,etat
    
    def regler_intensite(self, berceau_id, intensite):
        try:
            print(intensite)
            print(type(intensite))
            intensite = float(intensite)  # Convertir intensit� en flottant
        except ValueError:
            print("L'intensit� doit �tre un nombre.")
            return
        
        if 0 <= intensite <= 1:
            self.led.value = intensite
            response = self.api.set_intensity(berceau_id, intensite)
            print(f"Intensit� r�gl�e � {intensite} : {response}")
        else:
            print("L'intensit� doit �tre comprise entre 0 et 1.")

