package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class LedManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public LedManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void getLedValue(String chmp,LedValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("Led").child("intensite").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Boolean ledControl = dataSnapshot.getValue(Boolean.class);
                callback.onValueReceived(ledControl);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    // Mettre à jour la valeur du LED
    public void ouvrirLed(String chmp, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("Led").child("intensite").setValue(1023)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }

    public void fermerLed(String chmp, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("Led").child("intensite").setValue(0)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }

    public void changeIntensite(String chmp,int value, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("Led").child("intensite").setValue(value)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }
    public interface LedValueCallback {
        void onValueReceived(Boolean value);
        void onFailure(Exception e);
    }


}
