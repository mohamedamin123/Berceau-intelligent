package com.example.appmobile.firebase;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class DHT11Manager {
    private FirebaseManager firebaseManager;

    public DHT11Manager() {
        this.firebaseManager = new FirebaseManager();
    }

    public void getTmpValue(LedValueCallback callback) {
        firebaseManager.getDatabase().child("tmp").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Float ledControl = dataSnapshot.getValue(Float.class);
                callback.onValueReceived(ledControl);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void getHmdValue(LedValueCallback callback) {
        firebaseManager.getDatabase().child("hmd").addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Float ledControl = dataSnapshot.getValue(Float.class);
                callback.onValueReceived(ledControl);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }
}
