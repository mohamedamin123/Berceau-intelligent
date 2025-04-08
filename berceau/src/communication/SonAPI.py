import requests
import os
from dotenv import load_dotenv

from utils.request import Request

class SonAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_son = f"{self.api_url}/sons"

    def save_son_data(self, berceau_id, son):
        return Request._send_request("post", "/", self.api_url_son, {"berceauId": berceau_id, "son": son})

    def get_son_data(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}", self.api_url_son)