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
    
    def regler_intensite(self, intensite):
        try:

            intensite = float(intensite)  # Convertir intensit� en flottant
            self.led.value = intensite

        except ValueError:
            print("L'intensite doit etre un nombre.")
            return
        


