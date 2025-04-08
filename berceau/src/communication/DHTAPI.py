import os
from dotenv import load_dotenv

from utils.request import Request

class DHTAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_dht = f"{self.api_url}/dhts"

    def save_dht_data(self, berceau_id, temperature, humidity):
        return Request._send_request("post", "/", self.api_url_dht, {"berceauId": berceau_id, "tmp": temperature, "hmd": humidity})

    def get_dht_data(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}", self.api_url_dht)

    def get_temperature(self, berceau_id):
        return Request._send_request("get", f"/tmp/{berceau_id}", self.api_url_dht)

    def get_humidity(self, berceau_id):
        return Request._send_request("get", f"/hmd/{berceau_id}", self.api_url_dht)