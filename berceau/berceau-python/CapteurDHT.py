#importation des bib nécessaire
import dht #bib pour capteur DHT11
import machine# bib pour les gpio
import time
from Capteur import Capteur
import WiFi as WiFi
from Firebase import Firebase
import gc  # Importation du module de gestion des ordures (garbage collection)

class CapteurDHT(Capteur):
    
    def __init__(self, pin, name,type,tmp,hmd,etat=False):
        super().__init__(pin, name, etat)
        self.initialiser(pin,type)
        self.tmp=tmp
        self.hmd=hmd


    def initialiser(self, pin,type):
        # Initialisation du capteur DHT11 ou DHT22 connecté à un GPIO spécifique
        self.etat=True
        if(type=="dht11"):
            self.sensor = dht.DHT11(machine.Pin(pin))
        elif(type=="dht22"):
            self.sensor = dht.DHT22(machine.Pin(pin))


    def getTmp(self):
         # Lire les données(tmp) du capteur
        try:
            self.sensor.measure()  # Lire les valeurs du capteur
            temp = self.sensor.temperature()  # Température
            return temp
        except OSError as e:
            print("Erreur dans mesurer temperature:", e)
            return -1,  #lorsque le capteur rencontre une erreur de lecture

    def getHmd(self):
         # Lire les données(hmd)  du capteur
        try:
            self.sensor.measure()  # Lire les valeurs du capteur
            humidity = self.sensor.humidity()  # Humidité
            return humidity
        except OSError as e:
            print("Erreur dans mesurer humidite:", e)
            return -1,  #lorsque le capteur rencontre une erreur de lecture


    

    def envoyerDonne(self, token):
        """Envoie l'état actuel de la LED à Firebase sous le nœud 'led'."""
        try:
            # On envoie les données sous 'led' sans ID spécifique
            temperature = self.getTmp()
            humidity = self.getHmd()

            if temperature == -1 or humidity == -1:
                print("Erreur lors de la lecture des données du capteur. Aucune donnée envoyée.")
                return

            data = {
                "temperature": temperature,
                "humidity": humidity
            }
            print("le data de dht est ",data)

            Firebase.send_data("dht", data, token)  # On passe le même endpoint 'led'
            gc.collect()
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'état : {e}")

    def recevoirDonne(self, token):
        """
        Récupère les données depuis Firebase et les utilise pour des opérations éventuelles.
        """
        try:
            # Récupération des données depuis Firebase
            data =  Firebase.get_data("dht", token)
            #print("Données récupérées depuis Firebase :", data)

            if data:
                # Vérification des attributs attendus dans les données récupérées
                if "temperature" in data:
                    self.tmp = data["temperature"]
                    print(f"Température mise à jour depuis Firebase : {self.tmp}°C")
                else:
                    print("La clé 'temperature' n'est pas présente dans les données récupérées.")

                if "humidity" in data:
                    self.hmd = data["humidity"]
                    print(f"Humidité mise à jour depuis Firebase : {self.hmd}%")
    
                else:
                    print("La clé 'humidity' n'est pas présente dans les données récupérées.")
                gc.collect()  # Libérer la mémoire après avoir démarré la LED
    
            else:
                #print("Aucune donnée récupérée depuis Firebase.")
                pass
        except Exception as e:
            print(f"Erreur lors de la réception des données  de {self.name}  depuis Firebase : {e}")
