package com.example.appmobile.service;

import android.Manifest;
import android.app.Service;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

public class BluetoothService extends Service {

    private static final String TAG = "BluetoothService";
    private static final UUID SERIAL_PORT_SERVICE_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private BluetoothSocket bluetoothSocket;
    private OutputStream outputStream;
    private InputStream inputStream;

    private final IBinder binder = new BluetoothBinder();

    public class BluetoothBinder extends Binder {
        public BluetoothService getService() {
            return BluetoothService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    // Connect to a Bluetooth device
    public void connect(BluetoothDevice device) {
        new Thread(() -> {
            try {
                if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                bluetoothSocket = device.createRfcommSocketToServiceRecord(SERIAL_PORT_SERVICE_UUID);
                bluetoothSocket.connect();
                outputStream = bluetoothSocket.getOutputStream();
                inputStream = bluetoothSocket.getInputStream();
                Log.d(TAG, "Connected to " + device.getName());
            } catch (IOException e) {
                Log.e(TAG, "Connection failed", e);
                stopSelf(); // Stop the service if connection fails
            }
        }).start();
    }

    // Send a message to the connected Bluetooth device
    public void sendMessage(String message) {
        new Thread(() -> {
            try {
                if (outputStream != null) {
                    outputStream.write(message.getBytes());
                    outputStream.flush();
                    Log.d(TAG, "Message sent: " + message);
                }
            } catch (IOException e) {
                Log.e(TAG, "Error sending message", e);
            }
        }).start();
    }

    // Read a message from the connected Bluetooth device
    public void readMessage() {
        new Thread(() -> {
            try {
                if (inputStream != null) {
                    byte[] buffer = new byte[1024];
                    int bytesRead = inputStream.read(buffer);
                    String message = new String(buffer, 0, bytesRead);
                    Log.d(TAG, "Message received: " + message);
                }
            } catch (IOException e) {
                Log.e(TAG, "Error reading message", e);
            }
        }).start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            if (bluetoothSocket != null) {
                bluetoothSocket.close();
            }
        } catch (IOException e) {
            Log.e(TAG, "Error closing Bluetooth socket", e);
        }
    }
}
