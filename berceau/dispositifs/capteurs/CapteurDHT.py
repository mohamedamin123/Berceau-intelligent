import adafruit_dht
from dispositifs.capteurs.Capteur import Capteur
from reseaux.Firebase import Firebase

class CapteurDHT(Capteur):
    def __init__(self, pin, name, type_capteur, tmp=0, hmd=0, etat=False):
        super().__init__(pin, name, etat)
        self.type_capteur = type_capteur
        self.tmp = tmp
        self.hmd = hmd
        self.sensor = self.initialiser(type_capteur)

    def initialiser(self, type_capteur):
        """Initialise le capteur DHT (DHT11 ou DHT22)"""
        if type_capteur.lower() == "dht11":
            return adafruit_dht.DHT11(self.pin)
        elif type_capteur.lower() == "dht22":
            return adafruit_dht.DHT22(self.pin)
        else:
            raise ValueError("Type de capteur non pris en charge : utilisez 'dht11' ou 'dht22'")

    def getTmp(self):
        """Lire la température depuis le capteur"""
        try:
            temperature = self.sensor.temperature
            if temperature is None:
                raise ValueError("Impossible de lire la température.")
            return temperature
        except Exception as e:
            print(f"Erreur dans la mesure de la température : {e}")
            return -1

    def getHmd(self):
        """Lire l'humidité depuis le capteur"""
        try:
            humidity = self.sensor.humidity
            if humidity is None:
                raise ValueError("Impossible de lire l'humidité.")
            return humidity
        except Exception as e:
            print(f"Erreur dans la mesure de l'humidité : {e}")
            return -1

    def envoyerDonne(self, token,chemin):
        """Envoie les données du capteur à Firebase"""
        try:
            temperature = self.getTmp()
            humidity = self.getHmd()

            if temperature == -1 or humidity == -1:
                print("Erreur de lecture des données. Aucune donnée envoyée.")
                return

            data = {
                "tmp": temperature,
                "hmd": humidity
            }
            Firebase.send_data(chemin, data, token)
        except Exception as e:
            print(f"Erreur lors de l'envoi des données : {e}")

    def recevoirDonne(self, token,chemin):
        """Récupère les données depuis Firebase"""
        try:
            data = Firebase.get_data(chemin, token)

            if data:
                self.tmp = data["tmp"]
                self.hmd = data["hmd"]
            
        except Exception as e:
            print(f"Erreur lors de la réception des données : {e}")
