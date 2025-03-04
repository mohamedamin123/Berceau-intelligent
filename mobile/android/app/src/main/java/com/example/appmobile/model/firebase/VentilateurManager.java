package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class VentilateurManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public VentilateurManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    // Obtenir l'état actuel
    public void getEtat(String chmp, VentilateurValueCallback<Boolean> callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("etat")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Boolean etat = dataSnapshot.getValue(Boolean.class);
                        callback.onValueReceived(etat);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }

    // Définir un nouvel état
    public void setEtat(String chmp, Boolean etat, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("etat")
                .setValue(etat)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(callback::onFailure);
    }

    // Obtenir le mode actuel
    public void getMode(String chmp, VentilateurValueCallback<String> callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("mode")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        String mode = dataSnapshot.getValue(String.class);
                        callback.onValueReceived(mode);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }

    // Changer le mode
    public void changeMode(String chmp, String mode, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("mode")
                .setValue(mode)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(callback::onFailure);
    }

    public void getTmpSouhaite(String chmp, VentilateurValueCallback<Integer> callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("tmpSouhaite")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (dataSnapshot.exists() && dataSnapshot.getValue() != null) {
                            Integer tmp = dataSnapshot.getValue(Integer.class);
                            callback.onValueReceived(tmp);
                        } else {
                            callback.onValueReceived(0); // Provide a default value (e.g., 0)
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }

    // Changer le mode
    public void changeTmpSouhaite(String chmp, int value, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("Ventilateur").child("tmpSouhaite")
                .setValue(value)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(callback::onFailure);
    }


    public interface VentilateurValueCallback<T> {
        void onValueReceived(T value);
        void onFailure(Exception e);
    }


}
