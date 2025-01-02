import bluetooth

class BluetoothServer:
    def __init__(self, port=bluetooth.PORT_ANY):
        # Crée un serveur Bluetooth en utilisant RFCOMM
        self.server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        self.port = port
        self.client_socket = None
        self.client_address = None

    def start_server(self):
        """
        Démarre le serveur Bluetooth et attend une connexion.
        """
        try:
            self.server_socket.bind(("", self.port))
            self.server_socket.listen(1)
            print("En attente de connexion...")
            self.client_socket, self.client_address = self.server_socket.accept()
            print(f"Appareil connecté : {self.client_address}")
        except bluetooth.BluetoothError as e:
            print(f"Erreur lors du démarrage du serveur : {e}")

    def send_message(self, message):
        """
        Envoie un message à l'appareil connecté.
        """
        try:
            if self.client_socket:
                self.client_socket.send(message)
                print(f"Message envoyé: {message}")
            else:
                print("Aucun appareil connecté.")
        except bluetooth.BluetoothError as e:
            print(f"Erreur lors de l'envoi du message: {e}")

    def receive_message(self):
        """
        Reçoit un message de l'appareil connecté, divise la phrase en mots, 
        et lit chaque mot dans une liste.
        """
        try:
            if self.client_socket:
                message = self.client_socket.recv(1024)  # Recevoir jusqu'à 1024 octets
                if message:
                    decoded_message = message.decode('utf-8')
                    words = decoded_message.split()  # Diviser le message en mots
                    return words
                else:
                    print("Aucun message reçu ou connexion fermée.")
            else:
                print("Aucun appareil connecté.")
        except bluetooth.BluetoothError as e:
            print(f"Erreur lors de la réception du message : {e}")
            return None

    def close_connection(self):
        """
        Ferme la connexion avec l'appareil Bluetooth et arrête le serveur.
        """
        try:
            if self.client_socket:
                self.client_socket.close()
                print("Connexion fermée avec l'appareil.")
            self.server_socket.close()
            print("Serveur Bluetooth arrêté.")
        except bluetooth.BluetoothError as e:
            print(f"Erreur lors de la fermeture de la connexion : {e}")
