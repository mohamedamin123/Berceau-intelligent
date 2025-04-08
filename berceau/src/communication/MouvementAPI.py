import os
from dotenv import load_dotenv

from utils.request import Request

class MouvementAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_mouvement = f"{self.api_url}/mouvements"

    def save_mouvement_data(self, berceau_id, mouvement):
        return Request._send_request("post", "/", self.api_url_mouvement, {"berceauId": berceau_id, "mvt": mouvement})

    def get_mouvement_data(self, berceau_id):
        return Request._send_request("get", f"/{berceau_id}", self.api_url_mouvement)