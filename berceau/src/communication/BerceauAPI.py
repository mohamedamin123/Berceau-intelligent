import os
from dotenv import load_dotenv

from utils.request import Request

class BerceauAPI:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        self.api_url = os.getenv("API_URL")
        self.api_url_berceau = f"{self.api_url}/berceaux"


    def get_data(self, berceau_id):
        if not berceau_id:
            print("Erreur : l'identifiant du berceau est vide ou invalide.")
            return None

        try:
            response = Request._send_request("get", f"/id/{berceau_id}", self.api_url_berceau)
            return response
        except Exception as e:
            print(f"Erreur lors de la r�cup�ration des donn�es du berceau '{berceau_id}': {e}")
            return None
