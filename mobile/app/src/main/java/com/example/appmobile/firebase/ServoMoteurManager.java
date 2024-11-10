package com.example.appmobile.firebase;

import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class ServoMoteurManager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public ServoMoteurManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void getServoValue(ServoValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("servo").addListenerForSingleValueEvent(new ValueEventListener() {
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
    public void setServoValue(Boolean value, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("servo").setValue(value)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }

    public interface ServoValueCallback {
        void onValueReceived(Boolean value);
        void onFailure(Exception e);
    }


}
