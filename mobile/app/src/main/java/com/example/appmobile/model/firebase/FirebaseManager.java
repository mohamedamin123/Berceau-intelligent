package com.example.appmobile.model.firebase;

import android.content.Context;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class FirebaseManager {

    private static final String TAG = "FirebaseManager";
    private FirebaseAuth auth;
    private DatabaseReference database;
    private Context context; // Context to show Toast messages

    // Constructeur avec contexte
    public FirebaseManager(Context context) {
        this.auth = FirebaseAuth.getInstance();
        this.database = FirebaseDatabase.getInstance().getReference();
        this.context = context;
    }
    public FirebaseManager() {
        this.auth = FirebaseAuth.getInstance();
        this.database = FirebaseDatabase.getInstance().getReference();
    }

    public FirebaseUser getCurrentUser() {
        return auth.getCurrentUser();
    }

    public FirebaseAuth getAuth() {
        return auth;
    }

    public void setAuth(FirebaseAuth auth) {
        this.auth = auth;
    }

    public void setDatabase(DatabaseReference database) {
        this.database = database;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public DatabaseReference getDatabase() {
        return database;
    }


}
