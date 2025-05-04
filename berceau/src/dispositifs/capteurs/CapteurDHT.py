import board
import adafruit_dht
from communication.DHTAPI import DHTAPI
from dispositifs.capteurs.Capteur import Capteur

class CapteurDHT(Capteur):
    def __init__(self, pin=board.D4):
        self.dht_device = adafruit_dht.DHT22(pin)
        self.api = DHTAPI()

    def obtenir_temperature(self, berceau_id):
        return self.api.get_temperature(berceau_id)

    def obtenir_humidite(self, berceau_id):
        return self.api.get_humidity(berceau_id)
    
    def lire_donnees(self):
        try:
            temperature = self.dht_device.temperature
            humidite = self.dht_device.humidity
            if temperature is not None and humidite is not None:
                return temperature, humidite
            else:
                return None, None
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur DHT : {e}")
            return None, None

    def envoyer_donnees(self, berceau_id):
        temperature, humidite = self.lire_donnees()
        if temperature is not None and humidite is not None:
            response = self.api.save_dht_data(berceau_id, temperature, humidite)
            print(f"Données envoyées : {response}")
        else:
            print("Échec de la lecture du capteur, données non envoyées.")
