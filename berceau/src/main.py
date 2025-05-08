import threading
import time
import os
import subprocess
from dispositifs.actionnaires.ActionnaireLed import ActionneurLED
from dispositifs.actionnaires.ActionnaireServo import ActionneurServo
from dispositifs.actionnaires.ActionnaireVentilateur import ActionneurVentilateur
from dispositifs.capteurs.CapteurDHT import CapteurDHT
from dispositifs.capteurs.CapteurMVT import CapteurMouvement
from dispositifs.capteurs.CapteurSon import CapteurSon
from reseaux.BluetoothServer import BluetoothServer
from reseaux.WifiServeur import WifiServeur
from gpiozero import Button

class Main:
    def __init__(self, berceau_id=None):
        # Si berceau_id est passé en paramètre, l'utiliser, sinon essayer de charger un ID existant.
        self.berceau_id = berceau_id or self.load_berceau_id()
        self.son = CapteurSon()
        self.mvt = CapteurMouvement()
        self.wifi = WifiServeur()
        self.blt = BluetoothServer()
        self.running = True


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
            
    def run_motion(self):
        try:
            self.motion_process = subprocess.Popen(['sudo', 'motion'])
            while self.running:
                time.sleep(1)
            if self.motion_process.poll() is None:
                self.motion_process.terminate()
                self.motion_process.wait()
        except Exception as e:
            print(f"Erreur dans run_motion: {e}")


    def run_son(self):
        while self.running:
            self.son.envoyer_donnees(self.berceau_id)
            time.sleep(1)

    def run_mvt(self):
        while self.running:
            self.mvt.envoyer_donnees(self.berceau_id)
            time.sleep(1)


    def run_led(self):
        led = ActionneurLED()
        while self.running:
            intensite, etat = led.obtenir_statut(self.berceau_id)


            if etat:
                led.regler_intensite(intensite)
            else:
                led.eteindre(self.berceau_id)
            time.sleep(2)

    def run_servo(self):
        servo = ActionneurServo()
        while self.running:
            mode, etat = servo.obtenir_statut(self.berceau_id)
            print("mode :", mode)
            print("etat avant action:", etat)
            if etat:
                if mode == "automatique" and self.son.lire_donnees():
                    servo.allumer(self.berceau_id)
                elif mode == "manuelle":
                    servo.allumer(self.berceau_id)
            else:
                servo.eteindre(self.berceau_id)

            # Lecture du statut apr�s action
            mode_apres, etat_apres = servo.obtenir_statut(self.berceau_id)
            print("etat apr�s action:", etat_apres)

            time.sleep(2)


    def run_ventilateur(self):
        ventilateur = ActionneurVentilateur()
        while self.running:
            mode,etat = ventilateur.obtenir_statut(self.berceau_id)
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
        while self.running:
            dht.envoyer_donnees(self.berceau_id)
            time.sleep(5)

    def lancer_bluetooth(self):
        words = self.blt.start_server()
        if words and len(words) > 2:
            self.berceau_id = words[2]  # Mise à jour de l'ID du berceau
            print("Berceau ID:", self.berceau_id)
            self.save_berceau_id()  # Enregistrer l'ID du berceau
            value = self.wifi.connect(words[0], words[1])
            return value


    def start(self):
        if self.running:
            self.threads = []

            # Threads des capteurs
            dht_thread = threading.Thread(target=self.run_dht)
            son_thread = threading.Thread(target=self.run_son)
            mvt_thread = threading.Thread(target=self.run_mvt)

            # Threads des actionneurs
            led_thread = threading.Thread(target=self.run_led)
            servo_thread = threading.Thread(target=self.run_servo)
            ventilateur_thread = threading.Thread(target=self.run_ventilateur)

            # Thread motion
            motion_thread = threading.Thread(target=self.run_motion)

            self.threads.extend([
                son_thread,
                #mvt_thread,
                #dht_thread,
                #led_thread,
                #servo_thread,
                #ventilateur_thread,
                #motion_thread
            ])

            for t in self.threads:
                t.start()


    def on_button_pressed(self):
        print("Bouton press�. Arr�t demand�...")

        # 1. Demander l'arr�t
        self.running = False

        # 2. Arr�ter tous les threads
        for thread in getattr(self, 'threads', []):
            if thread.is_alive():
                thread.join(timeout=5)

        print("Tous les threads arr�t�s.")

        # 3. R�initialiser Bluetooth
        self.blt.reset()

        # 4. Supprimer le fichier berceau_id.txt
        try:
            if os.path.exists("berceau_id.txt"):
                os.remove("berceau_id.txt")
                print("Fichier berceau_id.txt supprim�.")
        except Exception as e:
            print(f"Erreur lors de la suppression : {e}")

        # 5. R�initialiser l'�tat
        self.berceau_id = None
                # Ajouter le code pour r�activer le fonctionnement des capteurs et actionneurs apr�s l'arr�t
        self.running = True  # Repasser `running` � True pour reprendre le programme apr�s l'arr�t
        print("Red�marrage du programme...")
        self.start()  # D�marrer de nouveau les threads et capteurs


if __name__ == "__main__":
    main = Main()
    button = Button(14)
    button.when_pressed = main.on_button_pressed

    try:
        while True:
            if main.running:
                if main.wifi.is_connected() and main.berceau_id:
                    print("Wi-Fi d�j� connect�. Lancement des capteurs et actionneurs...")
                    main.start()
                else:
                    print("Wi-Fi non connect� ou ID manquant. Tentative de connexion via Bluetooth...")
                    success = main.lancer_bluetooth()
                    print(success and main.berceau_id )
                    if success:
                        print("Connexion Wi-Fi r�ussie via Bluetooth. Lancement des services...")
                        main.running = True
                        main.start()
                    else:
                        print("�chec de la connexion Wi-Fi via Bluetooth.")
            time.sleep(5)
    except KeyboardInterrupt:
        print("Programme interrompu. Fermeture en douceur.")

