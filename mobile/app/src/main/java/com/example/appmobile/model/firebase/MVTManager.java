package com.example.appmobile.model.firebase;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.utils.Convertit;
import com.example.appmobile.utils.NotificationHelper;
import com.example.appmobile.view.connexion.LoginActivity;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import android.app.PendingIntent;
import android.content.Intent;
import android.widget.Toast;


public class MVTManager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;
    private Context context;
    private NotificationManager notificationManager;

    public MVTManager(FirebaseUser currentUser, Context context) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
        this.context = context;
        this.notificationManager = new NotificationManager(firebaseManager.getCurrentUser());
    }


    public void lireTousLesMVT() {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (dataSnapshot.exists()) {
                            for (DataSnapshot berceauSnapshot : dataSnapshot.getChildren()) {
                                String berceauKey = berceauSnapshot.getKey(); // Get dynamic key
                                if (berceauKey != null) {
                                    // Retrieve 'nom' value from the current 'berceau'
                                    String nom = berceauSnapshot.child("nom").getValue(String.class);

                                    // Read the specific 'CapteurMVT/mvtDect' for each 'berceau'
                                    firebaseManager.getDatabase()
                                            .child("users")
                                            .child(currentUser.getUid())
                                            .child("berceau")
                                            .child(berceauKey)
                                            .child("dispositifs")
                                            .child("CapteurMVT")
                                            .child("mvtDect")
                                            .addValueEventListener(new ValueEventListener() {
                                                @Override
                                                public void onDataChange(DataSnapshot mvtSnapshot) {
                                                    if (mvtSnapshot.exists()) {
                                                        Boolean isDetected = mvtSnapshot.getValue(Boolean.class);
                                                        if (isDetected != null && isDetected) {
                                                            // Call the method to send the notification
                                                            String type = "Mouvement détecté - " + nom;
                                                            String message = "Un mouvement a été détecté dans le berceau : " + nom;
                                                            NotificationHelper.envoyerNotification(context,notificationManager,berceauKey,type,message);
                                                        }
                                                    }
                                                }

                                                @Override
                                                public void onCancelled(DatabaseError databaseError) {
                                                    Log.e("MVTManager", "Error reading movement data: " + databaseError.getMessage());
                                                }
                                            });
                                }
                            }
                        } else {
                            Log.d("MVTManager", "No 'berceau' found for user.");
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        Log.e("MVTManager", "Error reading 'berceau': " + databaseError.getMessage());
                    }
                });
    }



}
