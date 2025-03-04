package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class DHTManager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public DHTManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void listenToTmpValue(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("CapteurDHT").child("tmp").addValueEventListener(new ValueEventListener() {
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

    public void listenToHmdValue(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("dispositifs").child("CapteurDHT").child("hmd").addValueEventListener(new ValueEventListener() {
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
