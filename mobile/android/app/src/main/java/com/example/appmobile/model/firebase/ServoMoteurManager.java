package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.ValueEventListener;

public class ServoMoteurManager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public ServoMoteurManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser = currentUser;
    }

    // Obtenir l'état actuel
    public void getEtat(String chmp, ServoValueCallback<Boolean> callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("ServoMoteur").child("etat")
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
                .child("dispositifs").child("ServoMoteur").child("etat")
                .setValue(etat)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(callback::onFailure);
    }

    // Obtenir le mode actuel
    public void getMode(String chmp, ServoValueCallback<String> callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp)
                .child("dispositifs").child("ServoMoteur").child("mode")
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
                .child("dispositifs").child("ServoMoteur").child("mode")
                .setValue(mode)
                .addOnSuccessListener(aVoid -> callback.onSuccess())
                .addOnFailureListener(callback::onFailure);
    }

    // Interface pour le retour des valeurs
    public interface ServoValueCallback<T> {
        void onValueReceived(T value);
        void onFailure(Exception e);
    }
}
