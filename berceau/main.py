import os
import json
import time
import threading
import board
from dispositifs.Berceau import Berceau
from reseaux.Firebase import Firebase
from reseaux.Reseau_Wifi import Reseau_Wifi
from reseaux.Reseau_Bluetooth import BluetoothServer

from dispositifs.actionnaires.Lumiere import Lumiere
from dispositifs.actionnaires.ServoMoteur import ServoMotor
from dispositifs.actionnaires.Ventilateur import Ventilateur
from dispositifs.capteurs.CapteurDHT import CapteurDHT
from dispositifs.capteurs.CapteurSon import CapteurSon
from dispositifs.capteurs.CapteurMVT import CapteurMVT

# Initialisation des actionneurs et capteurs
servo = ServoMotor(15, 0, "Manuelle", "Servo motor", False)
fan = Ventilateur(22, 500, 20,etat=False,mode="Manuelle")
bassinet_led = Lumiere(2, "Red", 1, 0)
dht = CapteurDHT(board.D14, "DHT", "dht22", 0, 0)
son=CapteurSon(6,7,threshold=500)
bluetooth_server = BluetoothServer()
capMVT=CapteurMVT(18,"Capteur mvt")

# Variables globales
token = None
received_message = None
DATA_FILE = "bluetooth_data.json"  # Fichier pour sauvegarder les données Bluetooth
berceau_active_flag = True  # Flag pour indiquer si le berceau est actif

# Fonction pour sauvegarder les données reçues via Bluetooth
def save_bluetooth_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file)
    print("Données Bluetooth sauvegardées.")

# Fonction pour lire les données sauvegardées
def load_bluetooth_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    return None

# Connexion Wi-Fi et Firebase
def connect_wifi():
    global received_message, token

    # Charger les données sauvegardées si elles existent
    received_message = load_bluetooth_data()
    if received_message:
        print(f"Données chargées depuis le fichier : {received_message}")
    else:
        # Si aucune donnée n'est sauvegardée, démarrer le serveur Bluetooth
        bluetooth_server.start_server()
        time.sleep(2)  # Attendre pour s'assurer que la connexion est établie
        received_message = bluetooth_server.receive_message()

        if received_message:
            print(f"Message reçu de l'appareil Android : {received_message}")
            save_bluetooth_data(received_message)  # Sauvegarder les données reçues

    # Procéder à la connexion Wi-Fi et Firebase
    wifi = Reseau_Wifi()
    while not wifi.is_connected():
        ssid = received_message[0]
        password = received_message[1]

        if not ssid or not password:
            print("Erreur : SSID ou mot de passe invalide. Réessayez.")
            continue

        wifi.init_wifi(ssid, password)
        if wifi.is_connected():
            print("Connexion réussie au réseau Wi-Fi.")
            email = received_message[2]
            password = received_message[3]

            token = Firebase.authenticate_user(email, password)
            if token:
                print("Connecté à Firebase")
            else:
                print("Erreur de connexion à Firebase")
        else:
            print("Erreur de connexion Wi-Fi. Réessayez.")
    return True

# Envoi des données DHT
def send_dht(uidUser):
    """
    Envoie périodiquement les données du capteur DHT vers Firebase.
    
    Args:
        uidUser (str): L'UID de l'utilisateur pour récupérer le chemin Firebase.
    """
    global berceau_active_flag, received_message

    try:
        children = Firebase.get_children(f"users/{uidUser}/berceau", token)
        while True:    
            for child in children:
                chemin = f"users/{uidUser}/berceau/{child}/dispositifs/CapteurDHT"
                try:
                        dht.envoyerDonne(token, chemin)
                except Exception as e:
                        print(f"Erreur lors de l'envoi des données DHT pour {child}: {e}")
                time.sleep(3)
    except Exception as e:
        print(f"Erreur dans send_dht : {e}")


#envoi mouvement
def send_mvt(uidUser):
    """
    Envoie périodiquement les données du capteur DHT vers Firebase.
    
    Args:
        uidUser (str): L'UID de l'utilisateur pour récupérer le chemin Firebase.
    """
    global berceau_active_flag, received_message

    try:
        children = Firebase.get_children(f"users/{uidUser}/berceau", token)
        while True:
            for child in children:
                chemin = f"users/{uidUser}/berceau/{child}/dispositifs/CapteurMVT"
                try:
                        capMVT.envoyerDonne(token, chemin)
                except Exception as e:
                        print(f"Erreur lors de l'envoi des données mvt pour {child}: {e}")
                time.sleep(3)
    except Exception as e:
        print(f"Erreur dans mvt : {e}")


# Contrôle des dispositifs générique
def control_device(device, path, condition_callback, action_callback):
    while berceau_active_flag:
        try:
            device.recevoirDonne(token, path)
            if condition_callback(device):
                action_callback(device)
            else:
                device.arreter()
        except Exception as e:
            print(f"Erreur dans control_device pour {device}: {e}")
        time.sleep(2)

# Vérification de l'état du berceau
def berceau_active():
    uidUser = received_message[4]

    children = Firebase.get_children(f"users/{uidUser}/berceau", token)

    for child in children:
        chemin = f"users/{uidUser}/berceau/{child}"
        berceau_data = Firebase.get_data(chemin, token)
        if berceau_data and berceau_data.get("etat") == True:
            print(f"Le berceau {child} a l'état True.")
            return True
    print("Aucun berceau avec l'état True trouvé.")
    return False

# Lancer les threads pour chaque tâche
def start_threads():
    uidUser = received_message[4]
    children = Firebase.get_children(f"users/{uidUser}/berceau", token)

    for child in children:
        chemin = f"users/{uidUser}/berceau/{child}"
        berceau_data = Firebase.get_data(chemin, token)
        if berceau_data and berceau_data.get("etat") == True:
            chemin_base = f"users/{uidUser}/berceau/{child}"
        
            # Thread for sending DHT sensor data
            threading.Thread(target=send_dht, args=(uidUser,), daemon=True).start()
            # thread pour mvt
            threading.Thread(target=send_mvt, args=(uidUser,), daemon=True).start()

            # Thread for controlling the bassinet LED
            threading.Thread(target=control_device, args=(
                bassinet_led,
                f"{chemin_base}/dispositifs/Led",
                lambda d: d.etat,
                lambda d: d.ajusterIntensite(d.intensite),
            ), daemon=True).start()

    # Thread for controlling the fan
            threading.Thread(target=control_device, args=(
                fan,
                f"{chemin_base}/dispositifs/Ventilateur",
                lambda d: (d.mode == 'Manuelle' and d.etat) or (d.mode == 'Automatique' and dht.getTmp() > d.tmp_souhaite),
            
                lambda d: d.demarrer(),
            ), daemon=True).start()


            # Thread for controlling the servo motor
            threading.Thread(target=control_device, args=(
                servo,
                f"{chemin_base}/dispositifs/ServoMoteur",
                lambda d: d.etat,
                lambda d: d.deplacer(),
            ), daemon=True).start()

    uidUser = received_message[4]
    chemin_base = f"users/{uidUser}/berceau"
    
    # Thread pour envoyer les données du capteur DHT
    threading.Thread(target=send_dht, args=(uidUser,), daemon=True).start()

    # Thread pour contrôler la LED du berceau
    threading.Thread(target=control_device, args=(
        bassinet_led,
        f"{chemin_base}/dispositifs/Led",
        lambda d: d.etat,
        lambda d: d.ajusterIntensite(d.intensite),
    ), daemon=True).start()

    # Thread pour contrôler le ventilateur
    threading.Thread(target=control_device, args=(
        fan,
        f"{chemin_base}/dispositifs/Ventilateur",
        lambda d: (d.mode == "Manuelle" and d.etat) or (d.mode == "Automatique" and dht.getTmp() > d.tmp_souhaite),
        lambda d: d.demarrer(),
    ), daemon=True).start()

    # Thread pour contrôler le servo moteur
    threading.Thread(target=control_device, args=(
        servo,
        f"{chemin_base}/dispositifs/ServoMoteur",
        lambda d: (d.mode == "Manuelle" and d.etat) or (d.mode == "Automatique" and son.detect_sound_analogique()),
        lambda d: deplacer_plusieurs_fois(d, duree=60, intervalle=5) if d.mode == "Automatique" else d.deplacer(),
    ), daemon=True).start()


# Fonction pour déplacer le servomoteur plusieurs fois sur une durée de 1 minute
def deplacer_plusieurs_fois(servo, duree=60, intervalle=5):
    """
    Déplace le servomoteur plusieurs fois pendant une durée donnée.
    
    Args:
        servo (ServoMotor): L'instance du servomoteur.
        duree (int): Durée totale en secondes (par défaut 60 secondes).
        intervalle (int): Intervalle entre chaque mouvement en secondes (par défaut 5 secondes).
    """
    start_time = time.time()
    while time.time() - start_time < duree:
        servo.deplacer()
        time.sleep(intervalle)
# Main
if __name__ == "__main__":
    try:
        while connect_wifi():
            uidUser = received_message[4]

            # Toujours démarrer les threads pour les capteurs DHT et MVT
            threading.Thread(target=send_dht, args=(uidUser,), daemon=True).start()
            threading.Thread(target=send_mvt, args=(uidUser,), daemon=True).start()

            if berceau_active():
                berceau_active_flag = True
                start_threads()

            while berceau_active_flag:
                if not berceau_active():
                    berceau_active_flag = False
                    break
                time.sleep(1)
    except KeyboardInterrupt:
        print("Arrêt du programme.")
    except Exception as e:
        print(f"Erreur inattendue : {e}")
