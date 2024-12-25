package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class ClimatiseurManager {

    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public ClimatiseurManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void getClimValue(CLimValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("clim").addListenerForSingleValueEvent(new ValueEventListener() {
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
    public void setClimValue(Boolean value, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("clim").setValue(value)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }

    public interface CLimValueCallback {
        void onValueReceived(Boolean value);
        void onFailure(Exception e);
    }


}
