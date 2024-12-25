package com.example.appmobile.model.firebase;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.example.appmobile.model.firebase.interfaces.DataCallback;
import com.example.appmobile.model.firebase.interfaces.SignInCallback;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.model.firebase.interfaces.ValueExistCallback;
import com.example.appmobile.model.entity.Parent;
import com.example.appmobile.view.connexion.CompteExisteActivity;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class ParentRepository {

    private static final String TAG = "ParentManager";
    private final FirebaseManager firebaseManager;

    // Constructeur
    public ParentRepository(Context context) {
        this.firebaseManager = new FirebaseManager(context);
    }

    // Déconnexion
    public void signOut() {
        firebaseManager.getAuth().signOut();
    }

    // Vérifier si l'email existe
    public void isEmailExist(String email, ValueExistCallback callback) {
        firebaseManager.getDatabase().child("users").orderByChild("email").equalTo(email)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        callback.onCheckComplete(dataSnapshot.exists());
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        Log.w(TAG, "Erreur lors de la vérification de l'email", databaseError.toException());
                        callback.onCheckComplete(false);
                    }
                });
    }

    // Inscription
    public void signUp(String email, String password, String firstName, String lastName, SignInCallback callback) {
        isEmailExist(email, exists -> {
            if (exists) {
                // Email déjà existant
                Intent intent = new Intent(firebaseManager.getContext(), CompteExisteActivity.class);
                intent.putExtra("nom", lastName);
                intent.putExtra("prenom", firstName);
                intent.putExtra("email", email);
                firebaseManager.getContext().startActivity(intent);
            } else {
                // Inscription si l'email n'existe pas
                firebaseManager.getAuth().createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(task -> {
                            if (task.isSuccessful()) {
                                Log.d(TAG, "Inscription réussie");
                                FirebaseUser user = firebaseManager.getAuth().getCurrentUser();
                                if (user != null) {
                                    Parent parent = new Parent(lastName, firstName, email);
                                    saveUser(user.getUid(), parent);
                                    callback.onSuccess(user);
                                }
                            } else {
                                Log.w(TAG, "Échec de l'inscription", task.getException());
                                callback.onFailure(task.getException());
                            }
                        });
            }
        });
    }

    // Sauvegarder un utilisateur
    private void saveUser(String userId, Parent parent) {
        firebaseManager.getDatabase().child("users").child(userId).setValue(parent)
                .addOnSuccessListener(aVoid -> Log.d(TAG, "Données utilisateur sauvegardées avec succès"))
                .addOnFailureListener(e -> Log.w(TAG, "Échec de la sauvegarde des données utilisateur", e));
    }

    // Connexion
    public void signIn(String email, String password, SignInCallback callback) {
        firebaseManager.getAuth().signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        Log.d(TAG, "Connexion réussie");
                        FirebaseUser user = firebaseManager.getAuth().getCurrentUser();
                        if (user != null) {
                            getUser(user.getUid(), new DataCallback<Parent>() {
                                @Override
                                public void onSuccess(Parent parent) {
                                    Log.d(TAG, "Utilisateur connecté : " + parent.toString());
                                    callback.onSuccess(user);
                                }

                                @Override
                                public void onFailure(Exception e) {
                                    Log.w(TAG, "Erreur lors du chargement des données utilisateur", e);
                                    callback.onFailure(e);
                                }
                            });
                        }
                    } else {
                        Log.w(TAG, "Échec de la connexion", task.getException());
                        callback.onFailure(task.getException());
                    }
                });
    }

    // Récupérer un utilisateur
    public void getUser(String userId, DataCallback<Parent> callback) {
        firebaseManager.getDatabase().child("users").child(userId)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        Parent parent = dataSnapshot.getValue(Parent.class);
                        callback.onSuccess(parent);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        Log.w(TAG, "Erreur lors de la récupération de l'utilisateur", databaseError.toException());
                        callback.onFailure(databaseError.toException());
                    }
                });
    }

    // Mise à jour des données utilisateur
    public void updateUser(String userId, Parent parent) {
        firebaseManager.getDatabase().child("users").child(userId).setValue(parent)
                .addOnSuccessListener(aVoid -> Log.d(TAG, "Données utilisateur mises à jour avec succès"))
                .addOnFailureListener(e -> Log.w(TAG, "Échec de la mise à jour des données utilisateur", e));
    }

    // Suppression d'un utilisateur
    public void deleteUser(String userId) {
        firebaseManager.getDatabase().child("users").child(userId).removeValue()
                .addOnSuccessListener(aVoid -> Log.d(TAG, "Utilisateur supprimé avec succès"))
                .addOnFailureListener(e -> Log.w(TAG, "Échec de la suppression de l'utilisateur", e));
    }

    // Réinitialiser le mot de passe
    public void sendPasswordResetEmail(String email, UpdateValueCallback callback) {
        firebaseManager.getAuth().sendPasswordResetEmail(email)
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        Log.d(TAG, "Email de réinitialisation envoyé.");
                        callback.onSuccess();
                    } else {
                        Log.w(TAG, "Échec de l'envoi de l'email de réinitialisation", task.getException());
                        callback.onFailure(task.getException());
                    }
                });
    }
}
