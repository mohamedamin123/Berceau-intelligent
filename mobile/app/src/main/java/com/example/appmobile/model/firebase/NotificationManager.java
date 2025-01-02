package com.example.appmobile.model.firebase;

import androidx.annotation.NonNull;

import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.entity.CapteurDHT;
import com.example.appmobile.model.entity.CapteurMVT;
import com.example.appmobile.model.entity.Dispositif;
import com.example.appmobile.model.entity.Led;
import com.example.appmobile.model.entity.ServoMoteur;
import com.example.appmobile.model.entity.Ventilateur;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
                .child("berceau") // Accéder directement à "berceau"
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        if (snapshot.exists()) {
                            List<Notification> allNotifications = new ArrayList<>();
                            final int berceauCount = (int) snapshot.getChildrenCount();
                            final int[] berceauProcessedCount = {0}; // To keep track of processed "berceau"

                            // Parcourir chaque "berceau" pour récupérer les notifications
                            for (DataSnapshot berceauSnapshot : snapshot.getChildren()) {
                                String berceauKey = berceauSnapshot.getKey(); // Clé dynamique du berceau

                                if (berceauKey != null) {
                                    // Accéder aux notifications sous chaque "berceau"
                                    firebaseManager.getDatabase()
                                            .child("users")
                                            .child(currentUser.getUid())
                                            .child("berceau")
                                            .child(berceauKey) // Accéder à un sous-nœud spécifique
                                            .child("notifications") // Accéder aux notifications
                                            .addListenerForSingleValueEvent(new ValueEventListener() {
                                                @Override
                                                public void onDataChange(DataSnapshot dataSnapshot) {
                                                    List<Notification> notifications = new ArrayList<>();

                                                    for (DataSnapshot notificationSnapshot : dataSnapshot.getChildren()) {
                                                        Notification notification = notificationSnapshot.getValue(Notification.class);
                                                        if (notification != null) {
                                                            notifications.add(notification);
                                                        }
                                                    }

                                                    // Ajout des notifications de ce berceau à la liste globale
                                                    allNotifications.addAll(notifications);

                                                    // Incrémenter le compteur de berceaux traités
                                                    berceauProcessedCount[0]++;

                                                    // Vérifier si tous les berceaux ont été traités
                                                    if (berceauProcessedCount[0] == berceauCount) {
                                                        callback.onSuccess(allNotifications); // Appel du callback avec toutes les notifications
                                                    }
                                                }

                                                @Override
                                                public void onCancelled(DatabaseError databaseError) {
                                                    callback.onError(databaseError.toException());
                                                }
                                            });
                                }
                            }
                        } else {
                            callback.onError(new Exception("Aucun 'berceau' trouvé pour l'utilisateur"));
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

    // Interface callback for async operations
    public interface NotificationCallback {
        void onSuccess(List<Notification> notifications);
        void onError(Exception e);
    }
}
