package com.example.appmobile.firebase;

import android.content.Context;

import com.example.appmobile.model.User;
import com.example.appmobile.ui.connexion.ConfirmerEmailActivity;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class UserManager {

    private FirebaseManager firebaseManager;
    private Context context;

    public UserManager() {
        this.firebaseManager = new FirebaseManager(context);
    }



    public void getUserData(String userId, FirebaseManager.UserDataCallback callback) {
        firebaseManager.getDatabase().child("users").child(userId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                User user = dataSnapshot.getValue(User.class);
                if (user != null) {
                    callback.onUserDataReceived(user);
                } else {
                    callback.onFailure(new Exception("User not found"));
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }




}
