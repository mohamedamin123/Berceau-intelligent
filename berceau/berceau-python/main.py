import time
import machine

import asyncio
import time
import gc

from CapteurDHT import CapteurDHT
from Servomoteur import ServoMotor
from Ventilateur import Ventilateur
from WiFi import Wifi
from Firebase import Firebase
from Led import Led
from CapteurSon import CapteurSon
from CapteurMVT import CapteurMVT
import gc

# Initialisation des objets

# Partie actionneur
servo = ServoMotor(15, 0, "Auto", "Servo moteur", False)
ventilateur = Ventilateur(22, 500, 20)
led_berceau = Led(2, "Rouge", 1, 0)

# Partie capteur
dht = CapteurDHT(14, "DHT", "dht22", 0, 0)
capteur_son = CapteurSon(pin_analogique=34, pin_numerique=25, threshold=500)
capteur_mvt = CapteurMVT(13, "Capteur de vibration")

# Initialisation de l'utilisateur
token = None


# Vos imports et initialisations ici...

# Connexion au Wi-Fi
async def connecter_wifi():
    wifi = Wifi()
    while not wifi.is_connected():
        ssid = input("Entrer SSID : ").strip()
        password = input("Entrer mot de passe : ").strip()

        if not ssid or not password:
            print("Erreur : SSID ou mot de passe invalide. Veuillez réessayer.")
            continue

        wifi.init_wifi(ssid, password)
        if wifi.is_connected():
            print("Connexion au réseau réussie.")
            email = "amin@amin.com"
            password = "amin123"
            token = Firebase.authenticate_user(email, password)
            if token:
                print("Connecté à Firebase")
            else:
                print("Erreur de connexion avec Firebase")
        else:
            print("Erreur dans la connexion Wi-Fi. Veuillez réessayer.")
    return True

async def envoyer_dht():
    while True:
        try:
            dht.envoyerDonne(token)
        except Exception as e:
            print(f"Erreur dans envoyer_dht : {e}")
        await asyncio.sleep(5)
        gc.collect()

async def control_led():
    while True:
        try:
            led_berceau.recevoirDonne(token)
            print(f"État de la LED : {led_berceau.etat}, Intensité de la LED : {led_berceau.intensite}")
            if led_berceau.etat:
                led_berceau.ajusterIntensite(led_berceau.intensite)
            else:
                led_berceau.arreter()
        except Exception as e:
            print(f"Erreur dans control_led : {e}")
        await asyncio.sleep(10)
        gc.collect()

async def control_ventilateur():
    while True:
        try:
            ventilateur.recevoirDonne(token)
            print(f"État de la Ventilateur : {ventilateur.etat}, mode de la Ventiltaur : {ventilateur.mode}")
            if ventilateur.mode == 'Auto':
                if dht.getTmp() > ventilateur.tmp_souhaite:
                    ventilateur.demarrer()
                else:
                    ventilateur.arreter()
            else:
                if ventilateur.etat:
                    ventilateur.demarrer()
                else:
                    ventilateur.arreter()
        except Exception as e:
            print(f"Erreur dans control_ventilateur : {e}")
        await asyncio.sleep(15)
        gc.collect()

async def control_servo():
    while True:
        try:
            servo.recevoirDonne(token)
            print(f"État de la servo moteur : {servo.etat}, mode de la servo : {servo.mode}")
            if servo.mode == 'Auto':
                while servo.mode == 'Auto':
                    if capteur_son.detect_sound_analogique():
                        print("Son détecté ! Déplacement du servo...")
                        debut = time.time()
                        while time.time() - debut < 60:
                            servo.deplacer(debut=0, fin=180, pas=10, delai=0.2)
                            await asyncio.sleep(0.5)
                        print("2 minutes écoulées. Arrêt du servo.")
                        break
            else:
                if servo.etat:
                    servo.deplacer()
                else:
                    servo.arreter()
        except Exception as e:
            print(f"Erreur dans control_servo : {e}")
        await asyncio.sleep(20)
        gc.collect()

async def envoyer_mouvement():
    while True:
        try:
            if capteur_mvt.lireMVT():
                print("Mouvement détecté")
                capteur_mvt.envoyerDonne(token)
                await asyncio.sleep(15)
                capteur_mvt.mvtDect = 0
                capteur_mvt.envoyerDonne(token)
        except Exception as e:
            print(f"Erreur dans envoyer_mouvement : {e}")
        await asyncio.sleep(5)
        gc.collect()

async def main():
    try:
        # Connexion au Wi-Fi
        await connecter_wifi()

        # Créer et lancer les tâches
        tasks = [
            envoyer_dht(),
            control_led(),
            control_ventilateur(),
            control_servo(),
            envoyer_mouvement()
        ]
        await asyncio.gather(*tasks)
    except KeyboardInterrupt:
        print("\nProgramme interrompu.")
    except Exception as e:
        print(f"Une erreur inattendue est survenue : {e}")

if __name__ == "__main__":
    asyncio.run(main())
