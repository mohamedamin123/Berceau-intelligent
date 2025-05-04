from communication.ServoAPI import ServoAPI
from dispositifs.actionnaires.Actionnaire import Actionnaire
from gpiozero import Servo
import time
from gpiozero.pins.pigpio import PiGPIOFactory


class ActionneurServo(Actionnaire):
    def __init__(self, pin=18):  # GPIO 18 par défaut
        self.servo = Servo(pin)
        self.api = ServoAPI()

    def allumer(self, berceau_id):
        self.servo.max()
        response = self.api.turn_on(berceau_id)
        print(f"Servo activé : {response}")

    def eteindre(self, berceau_id):
        self.servo.min()
        response = self.api.turn_off(berceau_id)
        print(f"Servo désactivé : {response}")

    def obtenir_statut(self, berceau_id):
        statut= self.api.get_status(berceau_id)
        etat=statut["etat"]
        mode=statut["mode"]
        return mode,etat
    
    def changer_mode(self, berceau_id):
        self.servo.mid()
        response = self.api.change_mode(berceau_id)
        print(f"Mode du servo changé : {response}")



