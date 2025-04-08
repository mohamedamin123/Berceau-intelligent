import requests
class Request:
    
    @staticmethod
    def _send_request(method, endpoint,api_url, data=None):
        url = f"{api_url}{endpoint}"
        try:
            if method == "get":
                response = requests.get(url)
            else:
                response = requests.post(url, json=data)

            print(f"Status Code: {response.status_code}")
            print(f"Raw Response: {response.text}")
            return response.json()
        except requests.exceptions.RequestException as e:
            print("Erreur de requ�te:", e)
            return {"error": str(e)}
