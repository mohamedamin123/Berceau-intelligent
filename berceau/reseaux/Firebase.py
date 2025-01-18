import requests


class Firebase:
    BASE_URL = "https://esp32-7fa75-default-rtdb.firebaseio.com"
    API_KEY = "AIzaSyAt8Y5awtPU6-TCGR9k_r0RXK84OFIlUmo"


    @staticmethod
    def authenticate_user(email, password):
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={Firebase.API_KEY}"
        data = {"email": email, "password": password, "returnSecureToken": True}
        try:
            response = requests.patch(url, json=data)
            if response.status_code == 200:
                return response.json().get('idToken')
            else:
                print(f"Erreur d'authentification: {response.text}")
                return None
        except Exception as e:
            print(f"Erreur lors de l'authentification: {e}")
            return None


    @staticmethod
    def send_data(endpoint, data, token=None):
        """Envoie des données à un endpoint Firebase."""
        url = f"{Firebase.BASE_URL}/{endpoint}.json"
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        try:
            response = requests.patch(url, json=data, headers=headers, timeout=10)  # Timeout ajouté
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Erreur d'envoi des données : {e}")

    @staticmethod
    def get_data(endpoint, token=None):
        """Récupère des données depuis un endpoint Firebase."""
        url = f"{Firebase.BASE_URL}/{endpoint}.json"
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        try:
            response = requests.get(url, headers=headers)  # Timeout ajouté
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erreur de récupération : {e}")
            return None

    @staticmethod
    def get_children(endpoint, token=None):
        """Récupère les enfants d'un chemin spécifique dans Firebase."""
        url = f"{Firebase.BASE_URL}/{endpoint}.json"
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        try:
            response = requests.get(url, headers=headers, timeout=10)  # Timeout ajouté
            response.raise_for_status()
            data = response.json()
            if isinstance(data, dict):
                # Récupère les clés enfants de l'objet JSON retourné
                return list(data.keys())
            else:
                # Si les données ne sont pas un dictionnaire, retourne une liste vide
                return []
        except requests.exceptions.RequestException as e:
            print(f"Erreur de récupération des enfants : {e}")
            return None