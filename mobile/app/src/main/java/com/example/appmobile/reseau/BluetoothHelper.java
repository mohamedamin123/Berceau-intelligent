package com.example.appmobile.reseau;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;

public class BluetoothHelper {

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private OutputStream outputStream;
    private InputStream inputStream;
    private Context context;

    private static final UUID SERIAL_PORT_SERVICE_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public BluetoothHelper(Context context) {
        this.context = context;
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    // Vérifier si le Bluetooth est activé
    public boolean isBluetoothEnabled() {
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    // Activer le Bluetooth
    public void enableBluetooth() {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED) {
            bluetoothAdapter.enable();
        } else {
            Toast.makeText(context, "Permission Bluetooth manquante", Toast.LENGTH_SHORT).show();
        }
    }

    // Obtenir un appareil couplé
    public BluetoothDevice getPairedDevice(String deviceName) {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(context, "Permission Bluetooth manquante 2", Toast.LENGTH_SHORT).show();
            return null; // Permission manquante
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        for (BluetoothDevice device : pairedDevices) {
            Log.d("bluetoothAdapter", device.getName());
            if (device.getName().equals(deviceName)) {
                return device; // Retourner l'appareil trouvé
            }
        }
        Toast.makeText(context, "Permission Bluetooth manquante 3", Toast.LENGTH_SHORT).show();
        return null; // Aucun appareil couplé trouvé avec ce nom
    }

    // Se connecter à un appareil
    public void connectToDevice(BluetoothDevice device) {
        try {
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(context, "Permission Bluetooth manquante", Toast.LENGTH_SHORT).show();
                return;
            }
            bluetoothSocket = device.createRfcommSocketToServiceRecord(SERIAL_PORT_SERVICE_UUID);
            bluetoothSocket.connect(); // Essayer de se connecter
            outputStream = bluetoothSocket.getOutputStream();
            inputStream = bluetoothSocket.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(context, "Échec de la connexion : " + e.getMessage(), Toast.LENGTH_SHORT).show();
            // Fermer le socket en cas d'échec
            close();
        }
    }

    // Vérifier si l'appareil est connecté
    public boolean isConnected() {
        return bluetoothSocket != null && bluetoothSocket.isConnected();
    }

    // Fermer la connexion Bluetooth
    public void close() {
        try {
            if (bluetoothSocket != null) {
                bluetoothSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    // Lire une réponse depuis l'ESP32
    public String readMessage() {
        try {
            if (inputStream != null) {
                byte[] buffer = new byte[1024]; // Taille du buffer pour stocker les données
                int bytesRead = inputStream.read(buffer); // Lire les données dans le buffer
                String receivedMessage = new String(buffer, 0, bytesRead); // Convertir les bytes en string
                Log.d("BluetoothHelper", "Message reçu: " + receivedMessage);
                return receivedMessage;
            } else {
                Log.d("BluetoothHelper", "Flux d'entrée non initialisé");
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.e("BluetoothHelper", "Erreur lors de la lecture du message: " + e.getMessage());
        }
        return null;
    }

    // Envoyer deux messages à l'ESP32 et lire la réponse
    public void sendTwoMessagesAndRead(String message1, String message2) {
        try {
            sendMessage(message1); // Envoyer le premier message
            Thread.sleep(250); // Pause de 500 ms après l'envoi du premier message

            sendMessage(message2); // Envoyer le deuxième message
            Thread.sleep(250); // Pause de 500 ms après l'envoi du deuxième message


            // Lire la réponse de l'ESP32

        } catch (InterruptedException e) {
            Log.e("BluetoothHelper", "Erreur lors du sommeil: " + e.getMessage());
            Thread.currentThread().interrupt(); // Réinitialiser le statut d'interruption
        }
    }

    public void sendMessage(String message) {
        try {
            if (outputStream != null) {
                // Envoyer le message en bytes
                outputStream.write(message.getBytes());
                outputStream.flush(); // S'assurer que les données sont bien envoyées
                Log.d("BluetoothHelper", "Message envoyé: " + message);
                String response = readMessage();
                if (response != null) {
                    Log.d("BluetoothHelper", "Réponse reçue de l'ESP32: " + response);
                } else {
                    Log.d("BluetoothHelper", "Aucune réponse reçue de l'ESP32");
                }
            } else {
                Log.d("BluetoothHelper", "Flux de sortie non initialisé");
            }
        } catch (IOException e) {
            e.printStackTrace();
            Log.e("BluetoothHelper", "Erreur lors de l'envoi du message: " + e.getMessage());
        }
    }

}

