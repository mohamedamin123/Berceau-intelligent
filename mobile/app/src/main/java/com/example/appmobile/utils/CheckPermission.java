package com.example.appmobile.utils;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

public class CheckPermission {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE = 3;
    private static final int ENABLE_BT_REQUEST_CODE = 3; // Code pour demander à activer Bluetooth

    static boolean isBluetoothEnabled() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    static boolean isLocationEnabled(Context context) {
        LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        return locationManager != null && locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }


    public static Boolean ouvrirLocation(Context context) {
        if (!isLocationEnabled(context)) {
            Toast.makeText(context, "Veuillez activer la localisation", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS); // Ouvre les paramètres de localisation
            context.startActivity(intent);
            return true;
        }
        return false;
    }


    public static Boolean ouvrirBluetooth(Context context, Activity activity) {
        if (!isBluetoothEnabled()) {
            Toast.makeText(context, "Veuillez activer le Bluetooth", Toast.LENGTH_SHORT).show();
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return true;
            }
            activity.startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), ENABLE_BT_REQUEST_CODE); // Demande d'activation du Bluetooth
            return true;
        }

        return false;

    }

    public static void verifierPermission(Activity context) {
        // Vérification des permissions Bluetooth et de localisation
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(context,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_REQUEST_CODE);
            }

            if (ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(context,

                        new String[]{Manifest.permission.BLUETOOTH},

                        BLUETOOTH_PERMISSION_REQUEST_CODE);

            }

        }
    }

}
