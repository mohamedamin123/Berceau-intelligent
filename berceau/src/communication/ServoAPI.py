import requests
import os
from dotenv import load_dotenv
from utils.request import Request

class ServoAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_servo = f"{self.api_url}/servos"

    def turn_on(self, berceau_id):
        return Request._send_request("post", f"/on/{berceau_id}",self.api_url_servo )

    def turn_off(self, berceau_id):
        return Request._send_request("post", f"/off/{berceau_id}",self.api_url_servo )

    def change_mode(self, berceau_id):
        return Request._send_request("post", f"/changeMode/{berceau_id}",self.api_url_servo )

    def get_status(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}",self.api_url_servo )

