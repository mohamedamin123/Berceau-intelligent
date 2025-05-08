import bluetooth
import subprocess
import socket
import time

class BluetoothServer:
    def __init__(self, port=bluetooth.PORT_ANY):
        self.server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        self.port = port
        self.client_socket = None
        self.client_address = None

    def make_discoverable(self):
        try:
            subprocess.run(["hciconfig", "hci0", "piscan"], check=True)
            print("Bluetooth device is now discoverable.")
        except subprocess.CalledProcessError as e:
            print(f"Failed to make device discoverable: {e}")
        except FileNotFoundError:
            print("hciconfig not found. Is Bluetooth installed and enabled?")

    def start_server(self):
        try:
            self.make_discoverable()
            self.server_socket.bind(("", self.port))
            self.server_socket.listen(1)

            bluetooth.advertise_service(
                self.server_socket,
                "BluetoothServer",
                service_classes=[bluetooth.SERIAL_PORT_CLASS],
                profiles=[bluetooth.SERIAL_PORT_PROFILE]
            )

            print("Waiting for a connection...")
            self.client_socket, self.client_address = self.server_socket.accept()
            print(f"Device connected: {self.client_address}")

            return self.listen_for_messages()  # ← ici on retourne les mots

        except bluetooth.BluetoothError as e:
            print(f"Bluetooth error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        finally:
            self.close_connection()

    def listen_for_messages(self):
        """
        Waits and listens continuously for incoming messages from the connected client.
        """
        self.client_socket.settimeout(None)

        while True:
            try:
                message = self.client_socket.recv(1024)
                if not message:
                    print("No message received. Client may have disconnected.")
                    break
                response = "Données recues avec succés."
                self.client_socket.send(response.encode('utf-8'))
                decoded = message.decode('utf-8')
                print(f"Message received: {decoded}")



                return decoded.split()  # ← Retourne une liste de mots par exemple ["wifi", "password", "berceau1"]

            except bluetooth.BluetoothError as e:
                print(f"Bluetooth error: {e}")
                break
            except Exception as e:
                print(f"Error receiving message: {e}")
                break


    def close_connection(self):
        try:
            if self.client_socket:
                self.client_socket.close()
                print("Client connection closed.")
            if self.server_socket:
                self.server_socket.close()
                print("Bluetooth server stopped.")
        except Exception as e:
            print(f"Error while closing connection: {e}")
            
    def reset(self):
        try:
            self.close_connection()
        except:
            pass
        self.server_socket = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        self.client_socket = None
        self.client_address = None
