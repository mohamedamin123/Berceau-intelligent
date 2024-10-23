package com.example.appmobile.reseau;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;
import android.widget.Toast;

public class WifiHelper {

    public static String getCurrentSsid(Context context) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        if (wifiManager.isWifiEnabled()) {
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            return wifiInfo.getSSID().replaceAll("\"", ""); // Remove quotes if present
        } else {
            Log.e("WifiHelper", "Wi-Fi is disabled");
            return null;
        }
    }

}
