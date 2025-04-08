import os
from dotenv import load_dotenv
from utils.request import Request

class VentilateurAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_ventilateur = f"{self.api_url}/ventilateurs"

    def turn_on(self, berceau_id):
        return Request._send_request("post", f"/on/{berceau_id}",self.api_url_ventilateur)

    def turn_off(self, berceau_id):
        return Request._send_request("post", f"/off/{berceau_id}",self.api_url_ventilateur)

    def change_mode(self, berceau_id):
        return Request._send_request("post", f"/changeMode/{berceau_id}",self.api_url_ventilateur)

    def get_status(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}",self.api_url_ventilateur)
