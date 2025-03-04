package com.example.appmobile.model.firebase;

import androidx.annotation.NonNull;

import com.example.appmobile.model.entity.Notification;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class NotificationManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public NotificationManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
    }
    public void displayNotification(final NotificationCallback callback) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if (!snapshot.exists()) {
                            callback.onError(new Exception("Aucun 'berceau' trouvé pour l'utilisateur"));
                            return;
                        }

                        List<Notification> allNotifications = new ArrayList<>();

                        for (DataSnapshot berceauSnapshot : snapshot.getChildren()) {
                            String berceauKey = berceauSnapshot.getKey();
                            if (berceauKey != null) {
                                firebaseManager.getDatabase()
                                        .child("users")
                                        .child(currentUser.getUid())
                                        .child("berceau")
                                        .child(berceauKey)
                                        .child("notifications")
                                        .addValueEventListener(new ValueEventListener() {
                                            @Override
                                            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                                                List<Notification> newNotifications = new ArrayList<>();

                                                for (DataSnapshot notificationSnapshot : dataSnapshot.getChildren()) {
                                                    Notification notification = notificationSnapshot.getValue(Notification.class);
                                                    if (notification != null) {
                                                        // Vérifier si la notification existe déjà pour éviter les doublons
                                                        if (!allNotifications.contains(notification)) {
                                                            newNotifications.add(notification);
                                                        }
                                                    }
                                                }

                                                synchronized (allNotifications) {
                                                    allNotifications.addAll(newNotifications);
                                                    callback.onSuccess(new ArrayList<>(allNotifications));
                                                }
                                            }

                                            @Override
                                            public void onCancelled(@NonNull DatabaseError databaseError) {
                                                callback.onError(databaseError.toException());
                                            }
                                        });
                            }
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError databaseError) {
                        callback.onError(databaseError.toException());
                    }
                });
    }


    public void AjouterNotification(String chmp,Notification notification) {
        // Get the notifications reference for the current user
        DatabaseReference notificationRef = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chmp)
                .child("notifications");

        // Add the new notification with a unique key
        notificationRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                int nextIndex = (int) dataSnapshot.getChildrenCount() + 1;
                notification.setIdNotification(nextIndex);
                String newNotificationKey = "Notification" + nextIndex; // e.g., "Notification1"
                DatabaseReference newNotificationRef = notificationRef.child(newNotificationKey);
                newNotificationRef.setValue(notification)
                        .addOnSuccessListener(aVoid -> System.out.println("Notification ajouté avec succès sous la clé : " + newNotificationKey))
                        .addOnFailureListener(e -> System.err.println("Erreur lors de l'ajout du notification : " + e.getMessage()));
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                System.err.println("Erreur lors de la récupération des données : " + databaseError.getMessage());
            }
        });
    }

    public void supprimerNotification(int idNotification, int berceauId) {
        DatabaseReference berceauRef = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child("berceau" + berceauId)
                .child("notifications")
                .child("Notification"+idNotification);

        // Supprimer le berceau de la base de données
        berceauRef.removeValue()
                .addOnSuccessListener(aVoid -> {
                    System.out.println("Berceau supprimé avec succès pour l'ID : " + idNotification);
                })
                .addOnFailureListener(e -> {
                    System.err.println("Erreur lors de la suppression du berceau : " + e.getMessage());
                });
    }

    // Interface callback for async operations
    public interface NotificationCallback {
        void onSuccess(List<Notification> notifications);
        void onError(Exception e);
    }
}
