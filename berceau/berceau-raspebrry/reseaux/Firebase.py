import urequests
import gc

class Firebase:
    BASE_URL = "https://esp32-7fa75-default-rtdb.firebaseio.com"
    API_KEY = "AIzaSyAt8Y5awtPU6-TCGR9k_r0RXK84OFIlUmo"

    @staticmethod
    def authenticate_user(email, password):
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={Firebase.API_KEY}"
        data = {"email": email, "password": password, "returnSecureToken": True}
        try:
            response = urequests.post(url, json=data)
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
        try:
            url = f"{Firebase.BASE_URL}/{endpoint}.json"
            headers = {"Authorization": f"Bearer {token}"} if token else {}
            response = urequests.patch(url, json=data, headers=headers)
            if response.status_code == 200:
                print(f"Données envoyées : {response.json()}")
            else:
                print(f"Erreur : {response.text}")
        except Exception as e:
            print(f"Erreur d'envoi des données : {e}")
        finally:
            gc.collect()

    @staticmethod
    def get_data(endpoint, token=None):
        try:
            url = f"{Firebase.BASE_URL}/{endpoint}.json"
            headers = {"Authorization": f"Bearer {token}"} if token else {}
            response = urequests.get(url, headers=headers)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erreur récupération : {response.text}")
                return None
        except Exception as e:
            print(f"Erreur de récupération : {e}")
        finally:
            gc.collect()
