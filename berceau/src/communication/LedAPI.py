import requests
import os
from dotenv import load_dotenv

from utils.request import Request

class LedAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_led = f"{self.api_url}/leds"

    def turn_on(self, berceau_id):
        return Request._send_request("post", "/on",self.api_url_led, {"berceauId": berceau_id})

    def turn_off(self, berceau_id):
        return Request._send_request("post", "/off",self.api_url_led ,{"berceauId": berceau_id})

    def set_intensity(self, berceau_id, intensity):
        return Request._send_request("post", "/intensite",self.api_url_led ,{"berceauId": berceau_id, "intensite": intensity})

    def get_status(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}",self.api_url_led)


