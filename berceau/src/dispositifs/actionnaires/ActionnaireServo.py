from communication.ServoAPI import ServoAPI
from dispositifs.actionnaires.Actionnaire import Actionnaire
from gpiozero import Servo
from gpiozero.pins.pigpio import PiGPIOFactory
import time
import math

class ActionneurServo(Actionnaire):
    def __init__(self, pin=18):  # GPIO 18 par d�faut
        # Configuration plus stable pour �viter les vibrations
        self.servo = Servo(
            pin,
            min_pulse_width=0.0006,
            max_pulse_width=0.0024,
        )
        self.api = ServoAPI()
        self.position = None  # Stocke la derni�re position du servo
        self.stabilization_time = 0.2  # Dur�e pour stabiliser le servo

    def set_position(self, value, label):
        # �vite les micro-mouvements inutiles
        if self.position is None or abs(self.position - value) > 0.05:
            self.servo.value = value
            self.position = value
            print(f"Servo tourn� � {label}� (valeur = {value})")
            time.sleep(self.stabilization_time)
            self.servo.detach()  # �vite les vibrations en d�sactivant le PWM

    def allumer(self, berceau_id):
        # Fonction pour convertir degr� en valeur servo (-1 � 1)
        def deg_to_value(degree):
            return (degree / 90.0) - 1  # 0� ? -1, 90� ? 0, 180� ? 1

        print("D�but du mouvement du servo (0� ? 180� ? 0�)")
        for angle in range(0, 181, 10):  # 0 � 180 par pas de 10
            value = deg_to_value(angle)
            self.set_position(value, angle)

        for angle in range(180, -1, -10):  # retour � 0
            value = deg_to_value(angle)
            self.set_position(value, angle)

        #response = self.api.turn_on(berceau_id)
        #print(f"Servo activ� : {response}")

    def eteindre(self, berceau_id):
        self.set_position(-0.9, 0)
        response = self.api.turn_off(berceau_id)
        print(f"Servo d�sactiv� : {response}")

    def changer_mode(self, berceau_id):
        self.set_position(0.0, 90)
        response = self.api.change_mode(berceau_id)
        print(f"Mode du servo chang� : {response}")

    def obtenir_statut(self, berceau_id):
        statut = self.api.get_status(berceau_id)
        etat = statut.get("etat", False)
        mode = statut.get("mode", "inconnu")
        return mode, etat
