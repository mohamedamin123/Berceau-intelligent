package com.example.appmobile.model.network;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

public class BluetoothHelper {

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private BluetoothDevice raspberryPiDevice;

    private Handler handler;
    private Context context;

    // UUID spécifique pour le service Bluetooth (RFCOMM)
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    public BluetoothHelper(Context context, Handler handler) {
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        this.handler = handler;
        this.context = context;
    }

    public boolean isBluetoothEnabled() {
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    public void enableBluetooth() {
        if (!isBluetoothEnabled()) {
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            bluetoothAdapter.enable();
        }
    }

    public void connectToRaspberryPi() {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();

        if (pairedDevices.size() > 0) {
            for (BluetoothDevice device : pairedDevices) {
                if (device.getName().equals("raspberrypi")) {
                    raspberryPiDevice = device;
                    break;
                }
            }
        }

        if (raspberryPiDevice == null) {
            handler.post(() -> Log.e("Bluetooth", "Appareil Raspberry Pi non trouvé."));
            return;
        }

        new Thread(() -> {
            try {
                if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }

                bluetoothSocket = (BluetoothSocket) raspberryPiDevice.getClass()
                        .getMethod("createRfcommSocket", int.class)
                        .invoke(raspberryPiDevice, 1);

                bluetoothSocket.connect();

                handler.post(() -> Log.d("Bluetooth", "Connecté à Raspberry Pi"));

            } catch (IOException | ReflectiveOperationException e) {
                handler.post(() -> Log.e("Bluetooth", "Erreur de connexion : " + e.getMessage()));
            }
        }).start();
    }

    public void sendMessage(String message) {
        if (bluetoothSocket != null) {
            try {
                bluetoothSocket.getOutputStream().write(message.getBytes());
            } catch (IOException e) {
                Log.e("Bluetooth", "Erreur d'envoi de message : " + e.getMessage());
            }
        }
    }

    public void closeConnection() {
        if (bluetoothSocket != null) {
            try {
                bluetoothSocket.close();
            } catch (IOException e) {
                Log.e("Bluetooth", "Erreur de fermeture de la connexion : " + e.getMessage());
            }
        }
    }
}
