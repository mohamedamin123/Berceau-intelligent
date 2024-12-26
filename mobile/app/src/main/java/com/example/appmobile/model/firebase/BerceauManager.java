package com.example.appmobile.model.firebase;

import com.example.appmobile.model.entity.Berceau;
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

public class BerceauManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public BerceauManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
    }

    public void displayBerceau(final BerceauCallback callback) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        List<Berceau> berceaux = new ArrayList<>();
                        for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                            Berceau berceau = snapshot.getValue(Berceau.class);

                            if (berceau != null && berceau.getDispositifs() != null) {
                                // Deserialize the dispositifs based on the 'type' field
                                for (int i = 0; i < berceau.getDispositifs().size(); i++) {
                                    if(berceau.getDispositifs().get(i)!=null) {
                                        String name = Objects.requireNonNull(berceau.getDispositifs().get(i)).getName();  // Assuming 'type' is a field in Dispositif

                                        // Deserialize the dispositif based on its type
                                        Dispositif actualDevice = createDeviceByName(name);
                                        if (actualDevice != null) {
                                            berceau.getDispositifs().put(String.valueOf(i), actualDevice);  // Set the correct device
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

    // Interface de rappel pour les opérations async
    public interface BerceauCallback {
        void onSuccess(List<Berceau> berceaux);
        void onError(Exception e);
    }
}
