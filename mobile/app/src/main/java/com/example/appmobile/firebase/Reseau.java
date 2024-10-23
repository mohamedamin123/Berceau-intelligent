package com.example.appmobile.firebase;

import android.content.Context;
import android.util.Log;

import com.example.appmobile.reseau.WifiHelper;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class Reseau {
    private FirebaseManager firebaseManager;
    public static String ssid;
    private String password;

    public Reseau(Context context, String password) {
        this.firebaseManager = new FirebaseManager();
        // Retrieve SSID only if permission is granted
        ssid = WifiHelper.getCurrentSsid(context);
        this.password = password;  // Ensure password is handled securely
    }



    public void seConnecterReseau(UpdateValueCallback callback) {
        // Get reference to the database
        DatabaseReference database = firebaseManager.getDatabase();

        // Check if SSID and password are valid
        if (isValidInput(ssid, password)) {
            // Create a data object to store in Firebase
            ReseauData data = new ReseauData(ssid, password);

            // Update the SSID and password in the Firebase database without deleting existing data
            database.child("reseauInfo").updateChildren(toMap())
                    .addOnSuccessListener(aVoid -> {
                        Log.d("Reseau", "Updated network info successfully");
                        callback.onSuccess();
                    })
                    .addOnFailureListener(e -> {
                        Log.e("Reseau", "Failed to update network info: " + e.getMessage());
                        callback.onFailure(e);
                    });
        } else {
            Log.e("Reseau", "SSID or password is missing or invalid");
        }
    }

    // In the ReseauData class
    public Map<String, Object> toMap() {
        Map<String, Object> result = new HashMap<>();
        result.put("ssid", ssid);
        result.put("password", password);
        return result;
    }


    private boolean isValidInput(String ssid, String password) {
        return ssid != null && !ssid.isEmpty() && password != null && !password.isEmpty();
    }

    // Inner class to represent data structure for Firebase
    public static class ReseauData {
        public String ssid;
        public String password;

        public ReseauData() { }  // Default constructor required for calls to DataSnapshot.getValue(ReseauData.class)

        public ReseauData(String ssid, String password) {
            this.ssid = ssid;
            this.password = password;
        }
    }

    // Getters and Setters
    public String getSsid() {
        return ssid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
