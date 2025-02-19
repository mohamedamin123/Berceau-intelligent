package com.example.appmobile.model.firebase;

import androidx.annotation.NonNull;

import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.CapteurDHT;
import com.example.appmobile.model.entity.CapteurMVT;
import com.example.appmobile.model.entity.Dispositif;
import com.example.appmobile.model.entity.Led;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.entity.ServoMoteur;
import com.example.appmobile.model.entity.Ventilateur;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class BerceauManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;
    private NotificationManager notificationManager;
    public BerceauManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
        this.notificationManager=new NotificationManager(currentUser);
    }

    public void displayBerceauRealtime(final BerceauCallback callback) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        List<Berceau> berceaux = new ArrayList<>();
                        for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                            Berceau berceau = snapshot.getValue(Berceau.class);

                            if (berceau != null && berceau.getDispositifs() != null) {
                                for (int i = 0; i < berceau.getDispositifs().size(); i++) {
                                    if (berceau.getDispositifs().get(i) != null) {
                                        String name = Objects.requireNonNull(berceau.getDispositifs().get(i)).getName();

                                        // Désérialisation en fonction du type
                                        Dispositif actualDevice = createDeviceByName(name);
                                        if (actualDevice != null) {
                                            berceau.getDispositifs().put(String.valueOf(i), actualDevice);
                                        }
                                    }
                                }
                            }

                            berceaux.add(berceau);
                        }
                        
                        callback.onSuccess(berceaux);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onError(databaseError.toException());
                    }
                });
    }


    public void AjouterBerceau(Berceau berceau) {

        // Récupérer le nombre actuel de berceaux sous l'utilisateur
        DatabaseReference berceauRef = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau");

        // Vérifier combien de berceaux existent déjà
        berceauRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // Calculer la prochaine clé (berceau1, berceau2, ...)
                int nextIndex = (int) dataSnapshot.getChildrenCount() + 1;
                berceau.setId(nextIndex);


                String newBerceauKey = "berceau" + nextIndex; // Par exemple, "berceau1", "berceau2", ...

                // Ajouter les dispositifs à ce berceau
                List<String> deviceNames = new ArrayList<>();
                deviceNames.add("CapteurDHT");
                deviceNames.add("CapteurMVT");
                deviceNames.add("Led");
                deviceNames.add("ServoMoteur");
                deviceNames.add("Ventilateur");

                for (String deviceName : deviceNames) {
                    Dispositif dispositif = createDeviceByName(deviceName);
                    if (dispositif != null) {
                        berceau.ajouterDispositif(dispositif);
                    }
                }

                // Utiliser la nouvelle clé pour ajouter le berceau
                DatabaseReference newBerceauRef = berceauRef.child(newBerceauKey);
                newBerceauRef.setValue(berceau)
                        .addOnSuccessListener(aVoid -> {
                            System.out.println("Berceau ajouté avec succès sous la clé : " + newBerceauKey);
                        })
                        .addOnFailureListener(e -> {
                            System.err.println("Erreur lors de l'ajout du berceau : " + e.getMessage());
                        });
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                System.err.println("Erreur lors de la récupération des données : " + databaseError.getMessage());
            }
        });
    }

    private Dispositif createDeviceByName(String deviceName) {
        switch (deviceName) {
            case "CapteurDHT":
                return new CapteurDHT();
            case "CapteurMVT":
                return new CapteurMVT();
            case "Led":
                return new Led();
            case "ServoMoteur":
                return new ServoMoteur();
            case "Ventilateur":
                return new Ventilateur();
            default:
                return null;
        }
    }

    public void miseAJour(String chemin) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chemin)
                .child("etat") // Chemin de l'attribut "etat" dans la base de données
                .setValue(true) // Met à jour la valeur de l'attribut à true
                .addOnSuccessListener(aVoid -> {
                    System.out.println("Mise à jour réussie : 'etat' défini à true.");
                })
                .addOnFailureListener(e -> {
                    System.err.println("Erreur lors de la mise à jour : " + e.getMessage());
                });
    }

    public void setAllEtatToFalse() {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                            // Parcours chaque berceau et met à jour l'attribut 'etat'
                            snapshot.getRef().child("etat").setValue(false)
                                    .addOnSuccessListener(aVoid -> {
                                        System.out.println("Mise à jour réussie : 'etat' défini à false pour " + snapshot.getKey());
                                    })
                                    .addOnFailureListener(e -> {
                                        System.err.println("Erreur lors de la mise à jour de " + snapshot.getKey() + " : " + e.getMessage());
                                    });
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        System.err.println("Erreur lors de la récupération des données : " + databaseError.getMessage());
                    }
                });
    }


    public void updateBerceauById(Berceau updatedBerceau) {

        DatabaseReference berceauRef0 = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau").child("berceau"+updatedBerceau.getId()).child("notifications");
        berceauRef0.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                List<Notification> notificationList = new ArrayList<>();

                for (DataSnapshot notificationSnapshot : snapshot.getChildren()) {
                    Notification notification = notificationSnapshot.getValue(Notification.class);
                    if (notification != null) {
                        notificationList.add(notification);
                    }
                }

                DatabaseReference berceauRef = firebaseManager.getDatabase()
                        .child("users")
                        .child(currentUser.getUid())
                        .child("berceau");

                // Search for the Berceau with the given ID
                berceauRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        boolean found = false;
                        for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                            Berceau existingBerceau = snapshot.getValue(Berceau.class);
                            if (existingBerceau != null && existingBerceau.getId() == updatedBerceau.getId()) {


                                snapshot.getRef().setValue(updatedBerceau)
                                        .addOnSuccessListener(aVoid -> {
                                            System.out.println("Berceau mis à jour avec succès pour ID : " + updatedBerceau.getId());
                                            for (Notification n:notificationList) {
                                                notificationManager.AjouterNotification("berceau"+updatedBerceau.getId(),n);
                                            }

                                        })
                                        .addOnFailureListener(e -> {
                                            System.err.println("Erreur lors de la mise à jour du berceau : " + e.getMessage());
                                        });
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            System.err.println("Aucun berceau trouvé avec l'ID : " + updatedBerceau.getId());
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        System.err.println("Erreur lors de la récupération des données : " + databaseError.getMessage());
                    }
                });

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    public void supprimerBerceau(int berceauId) {
        // Référence à la base de données pour accéder au berceau spécifique
        DatabaseReference berceauRef = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child("berceau" + berceauId);

        // Supprimer le berceau de la base de données
        berceauRef.removeValue()
                .addOnSuccessListener(aVoid -> {
                    System.out.println("Berceau supprimé avec succès pour l'ID : " + berceauId);
                })
                .addOnFailureListener(e -> {
                    System.err.println("Erreur lors de la suppression du berceau : " + e.getMessage());
                });
    }

    public void findByIdBerceau(int berceauId, BerceauCallback2 callback) {
        DatabaseReference berceauRef = firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child("berceau" + berceauId);

        berceauRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                Berceau berceau = snapshot.getValue(Berceau.class);
                if (berceau != null) {
                    callback.onSuccess(berceau);
                } else {
                    callback.onError(new Exception("Berceau non trouvé"));
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                callback.onError(error.toException());
            }
        });
    }


    // Interface de rappel pour les opérations async
    public interface BerceauCallback {
        void onSuccess(List<Berceau> berceaux);
        void onError(Exception e);
    }
    public interface BerceauCallback2 {
        void onSuccess(Berceau berceau);
        void onError(Exception e);
    }


}
