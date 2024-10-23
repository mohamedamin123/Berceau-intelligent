package com.example.appmobile.firebase;

import android.content.Context;
import android.util.Log;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class FirebaseManager {

    private static final String TAG = "FirebaseManager";
    private FirebaseAuth auth;
    private DatabaseReference database;

    // Constructeur
    public FirebaseManager() {
        auth = FirebaseAuth.getInstance();
        database = FirebaseDatabase.getInstance().getReference();
    }

    // Connexion à Firebase
    public void signIn(String email, String password, SignInCallback callback) {
        auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        Log.d(TAG, "Connexion réussie");
                        callback.onSuccess(auth.getCurrentUser());
                    } else {
                        Log.w(TAG, "Échec de la connexion", task.getException());
                        callback.onFailure(task.getException());
                    }
                });
    }

    // Récupérer la valeur du LED


    public DatabaseReference getDatabase() {
        return database;
    }


    // Interface pour les callbacks de connexion
    public interface SignInCallback {
        void onSuccess(FirebaseUser user);
        void onFailure(Exception e);
    }

}
