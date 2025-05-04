import threading
import time
import os

from dispositifs.actionnaires.ActionnaireLed import ActionneurLED
from dispositifs.actionnaires.ActionnaireServo import ActionneurServo
from dispositifs.actionnaires.ActionnaireVentilateur import ActionneurVentilateur
from dispositifs.capteurs.CapteurDHT import CapteurDHT
from dispositifs.capteurs.CapteurMVT import CapteurMouvement
from dispositifs.capteurs.CapteurSon import CapteurSon
from reseaux.BluetoothServer import BluetoothServer
from reseaux.WifiServeur import WifiServeur

class Main:
    def __init__(self, berceau_id=None):
        # Si berceau_id est passÃ© en paramÃ¨tre, l'utiliser, sinon essayer de charger un ID existant.
        self.berceau_id = berceau_id or self.load_berceau_id()
        self.son = CapteurSon()
        self.mvt = CapteurMouvement()
        self.wifi = WifiServeur()
        self.blt = BluetoothServer()

    def load_berceau_id(self):
        # Charger le berceau_id depuis un fichier (si existant)
        try:
            with open("berceau_id.txt", "r") as f:
                return f.read().strip()
        except FileNotFoundError:
            return None

    def save_berceau_id(self):
        # Sauvegarder le berceau_id dans un fichier
        with open("berceau_id.txt", "w") as f:
            f.write(self.berceau_id)

    def run_son(self):
        self.son.envoyer_donnees(self.berceau_id)

    def run_mvt(self):
        self.mvt.envoyer_donnees(self.berceau_id)


    def run_led(self):
        led = ActionneurLED()
        while True:
            etat, intensite = led.obtenir_statut(self.berceau_id)
            if etat:
                led.regler_intensite(self.berceau_id, intensite)
            else:
                led.eteindre(self.berceau_id)
            time.sleep(2)

    def run_servo(self):
        servo = ActionneurServo()
        while True:
            etat, mode = servo.obtenir_statut(self.berceau_id)
            if etat:
                if mode == "automatique" and self.son.lire_donnees():
                    servo.allumer(self.berceau_id)
                elif mode == "manuelle":
                    servo.allumer(self.berceau_id)
            else:
                servo.eteindre(self.berceau_id)
            time.sleep(2)

    def run_ventilateur(self):
        ventilateur = ActionneurVentilateur()
        while True:
            etat, mode = ventilateur.obtenir_statut(self.berceau_id)
            if etat:
                if mode == "automatique" and self.mvt.lire_donnees():
                    ventilateur.allumer(self.berceau_id)
                elif mode == "manuelle":
                    ventilateur.allumer(self.berceau_id)
            else:
                ventilateur.eteindre(self.berceau_id)
            time.sleep(2)

    def run_dht(self):
        dht = CapteurDHT()
        while True:
            dht.envoyer_donnees(self.berceau_id)
            time.sleep(5)

    def lancer_bluetooth(self):
        words = self.blt.start_server()
        if words and len(words) > 2:
            self.berceau_id = words[2]  # Mise Ã  jour de l'ID du berceau
            print("Berceau ID:", self.berceau_id)
            self.save_berceau_id()  # Enregistrer l'ID du berceau
            value = self.wifi.connect(words[0], words[1])
            return value

    def start(self):
        led_thread = threading.Thread(target=self.run_led)
        servo_thread = threading.Thread(target=self.run_servo)
        ventilateur_thread = threading.Thread(target=self.run_ventilateur)
        dht_thread = threading.Thread(target=self.run_dht)
        son_thread = threading.Thread(target=self.run_son)
        mvt_thread = threading.Thread(target=self.run_mvt)

        led_thread.start()
        servo_thread.start()
        ventilateur_thread.start()
        dht_thread.start()
        son_thread.start()
        mvt_thread.start()

        led_thread.join()
        servo_thread.join()
        ventilateur_thread.join()
        dht_thread.join()
        son_thread.join()
        mvt_thread.join()

if __name__ == "__main__":
    main = Main()

    try:
        while True:
            # VÃ©rifie si le Wi-Fi est dÃ©jÃ  connectÃ©
            if (main.wifi.is_connected() and main.berceau_id!=None):
                print("Wi-Fi dÃ©jÃ  connectÃ©. Lancement des capteurs et actionneurs...")
                main.start()
                break  # Sortir de la boucle une fois que tout est lancÃ©
            else:
                print("Wi-Fi non connectÃ©. Tentative de connexion via Bluetooth...")
                success = main.lancer_bluetooth()
                print(success)
                if success:
                    print("Connexion Wi-Fi rÃ©ussie via Bluetooth. Lancement des services...")
                    main.start()
                    break  # Sortir de la boucle aprÃ¨s un dÃ©marrage rÃ©ussi
                else:
                    print("Ãchec de la connexion Wi-Fi aprÃ¨s plusieurs tentatives via Bluetooth.")
            
            time.sleep(5)  # Attendre avant de rÃ©essayer

    except KeyboardInterrupt:
        print("Programme interrompu. Fermeture en douceur.")
