package com.example.appmobile.firebase;

import android.content.Context;
import android.util.Log;

import com.example.appmobile.reseau.WifiHelper;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class LedManager {

    private FirebaseManager firebaseManager;

    public LedManager() {
        this.firebaseManager = new FirebaseManager();
    }

    public void getLedValue(LedValueCallback callback) {
        firebaseManager.getDatabase().child("led1").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer ledControl = dataSnapshot.getValue(Integer.class);
                callback.onValueReceived(ledControl);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    // Mettre à jour la valeur du LED
    public void setLedValue(int value, UpdateValueCallback callback) {
        firebaseManager.getDatabase().child("led1").setValue(value)
                .addOnSuccessListener(aVoid -> {
                    callback.onSuccess();
                })
                .addOnFailureListener(callback::onFailure);
    }

}
