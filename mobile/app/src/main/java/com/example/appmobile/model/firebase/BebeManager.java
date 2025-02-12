package com.example.appmobile.model.firebase;

import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class BebeManager {
    private final FirebaseManager firebaseManager;
    private final FirebaseUser currentUser;

    public BebeManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
    }

    public void getValue(String chmp, String key, GetValueCallback callback) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chmp)
                .child("bebe")
                .child(key)
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Integer value = dataSnapshot.getValue(Integer.class);
                        callback.onValueReceived(value);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }

    public void initValue(String chmp, String key, GetValueCallback callback) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chmp)
                .child("bebe")
                .child(key)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (!dataSnapshot.exists() || dataSnapshot.getValue() == null) {
                            firebaseManager.getDatabase()
                                    .child("users")
                                    .child(currentUser.getUid())
                                    .child("berceau")
                                    .child(chmp)
                                    .child("bebe")
                                    .child(key)
                                    .setValue(0)
                                    .addOnSuccessListener(aVoid -> callback.onValueReceived(0))
                                    .addOnFailureListener(callback::onFailure);
                        } else {
                            callback.onValueReceived(dataSnapshot.getValue(Integer.class));
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }




    public DatabaseReference getDatabaseReference() {
        return FirebaseDatabase.getInstance().getReference();
    }

    public void getBebe(String chmp, GetValueCallback callback) {
        getDatabaseReference()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chmp)
                .child("bebe")
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Bebe bebe = dataSnapshot.getValue(Bebe.class);
                        if (bebe != null) {
                            callback.onValueReceived(bebe);  // Return the Bebe object via callback
                        } else {
                            callback.onFailure(new Exception("Bebe not found"));  // Handle missing data
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());  // Handle errors
                    }
                });
    }



    public void setValue(String chmp, String key, long valeur) {
        firebaseManager.getDatabase()
                .child("users")
                .child(currentUser.getUid())
                .child("berceau")
                .child(chmp)
                .child("bebe")
                .child(key)
                .setValue(valeur)
                .addOnSuccessListener(aVoid -> {
                    // Succès
                })
                .addOnFailureListener(e -> {
                    // Gérer l'échec
                });
    }



}
