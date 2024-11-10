package com.example.appmobile.firebase;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.example.appmobile.model.User;
import com.example.appmobile.ui.connexion.CompteExisteActivity;
import com.example.appmobile.ui.connexion.ConfirmerEmailActivity;
import com.example.appmobile.ui.connexion.RegisterActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

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

    // Déconnexion de Firebase
    public void signOut() {
        auth.signOut();
    }

    // Inscription à Firebase avec vérification de l'existence de l'email
    public void signUp(String email, String password, String firstName, String lastName, SignInCallback callback) {
        isEmailExist(email, exists -> {
            if (exists) {
                // Email already exists, show Toast message
                //Toast.makeText(context, "Cet email existe déjà.", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, CompteExisteActivity.class);
                intent.putExtra("nom",lastName);
                intent.putExtra("prenom",firstName);
                intent.putExtra("email",email);
                context.startActivity(intent);
            } else {
                // Email does not exist, proceed with sign up
                auth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(task -> {
                            if (task.isSuccessful()) {
                                Log.d(TAG, "Inscription réussie");
                                FirebaseUser user = auth.getCurrentUser();
                                if (user != null) {
                                    saveUser(user.getUid(), firstName, lastName, email);
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

    // Vérification de l'existence de l'email dans Firebase
    public void isEmailExist(String email, EmailExistCallback callback) {
        database.child("users").orderByChild("email").equalTo(email)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        // Check if any user has the given email
                        boolean exists = dataSnapshot.exists();
                        callback.onCheckComplete(exists);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        Log.w(TAG, "Erreur lors de la vérification de l'email", databaseError.toException());
                        callback.onCheckComplete(false); // Assume email doesn't exist if check fails
                    }
                });
    }

    // Sauvegarde des données de l'utilisateur dans Firebase Realtime Database
    private void saveUser(String userId, String firstName, String lastName, String email) {
        User user = new User(lastName, firstName, email,0,0,false,false,false);
        database.child("users").child(userId).setValue(user)
                .addOnSuccessListener(aVoid -> Log.d(TAG, "Données utilisateur sauvegardées avec succès"))
                .addOnFailureListener(e -> Log.w(TAG, "Échec de la sauvegarde des données utilisateur", e));
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


    public void sendPasswordResetEmail(String email, PasswordUpdateCallback callback) {
        auth.sendPasswordResetEmail(email)
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


    // Envoie un email pour réinitialiser le mot de passe
    public void updatePassword(String email, String newPassword, PasswordUpdateCallback callback) {
        // Step 1: Check if email exists in the database
        isEmailExist(email, exists -> {

            if (exists) {
                // Step 2: Authenticate the current user if needed (requires user to be signed in)
                FirebaseUser user = auth.getCurrentUser();
                if (user != null && user.getEmail().equals(email)) {
                    // Step 3: Update password
                    user.updatePassword(newPassword)
                            .addOnCompleteListener(task -> {
                                if (task.isSuccessful()) {
                                    Log.d(TAG, "Mot de passe mis à jour avec succès.");
                                    Toast.makeText(context, "Mot de passe mis à jour avec succès", Toast.LENGTH_SHORT).show();
                                    callback.onSuccess();
                                } else {
                                    Log.w(TAG, "Erreur lors de la mise à jour du mot de passe", task.getException());
                                    callback.onFailure(task.getException());
                                }
                            });
                } else {
                    Log.w(TAG, "Utilisateur non authentifié ou adresse email incorrecte");
                    Toast.makeText(context, "Veuillez vous connecter pour changer votre mot de passe.", Toast.LENGTH_SHORT).show();
                    callback.onFailure(new Exception("Non authentifié ou email incorrect"));
                }
            } else {
                // Email does not exist
                Log.w(TAG, "L'email n'existe pas dans la base de données");
                Toast.makeText(context, "Email introuvable.", Toast.LENGTH_SHORT).show();
                callback.onFailure(new Exception("Email introuvable"));
            }
        });
    }

    // Interface pour les callbacks de mise à jour du mot de passe
    public interface PasswordUpdateCallback {
        void onSuccess();
        void onFailure(Exception e);
    }



    // Interface de callback pour la vérification de l'existence de l'email
    public interface EmailExistCallback {
        void onCheckComplete(boolean exists);
    }

    // Interface pour les callbacks de connexion
    public interface SignInCallback {
        void onSuccess(FirebaseUser user);
        void onFailure(Exception e);
    }

    public DatabaseReference getDatabase() {
        return database;
    }


    public interface UserDataCallback {
        void onUserDataReceived(User user);
        void onFailure(Exception e);
    }

    public void getUserData(String userId, UserDataCallback callback) {
        database.child("users").child(userId).addListenerForSingleValueEvent(new ValueEventListener() {
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

    public interface UserDataUpdateCallback {
        void onSuccess();
        void onFailure(Exception e);
    }

    public void updateUserData(String userId, String newNom, String newPrenom, UserDataUpdateCallback callback) {
        database.child("users").child(userId).child("nom").setValue(newNom)
                .addOnSuccessListener(aVoid -> database.child("users").child(userId).child("prenom").setValue(newPrenom)
                        .addOnSuccessListener(aVoid1 -> {
                            Log.d(TAG, "Nom et prénom mis à jour avec succès.");
                            callback.onSuccess();
                        })
                        .addOnFailureListener(e -> {
                            Log.w(TAG, "Échec de la mise à jour du prénom", e);
                            callback.onFailure(e);
                        }))
                .addOnFailureListener(e -> {
                    Log.w(TAG, "Échec de la mise à jour du nom", e);
                    callback.onFailure(e);
                });
    }
}
