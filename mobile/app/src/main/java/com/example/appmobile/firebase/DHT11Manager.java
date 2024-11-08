package com.example.appmobile.firebase;

import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class DHT11Manager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public DHT11Manager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void listenToTmpValue(LedValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("tmp").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Float tmpValue = dataSnapshot.getValue(Float.class);
                callback.onValueReceived(tmpValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void listenToHmdValue(LedValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("hmd").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Float hmdValue = dataSnapshot.getValue(Float.class);
                callback.onValueReceived(hmdValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }
}
