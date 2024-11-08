package com.example.appmobile.ui.connexion;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityLoginBinding;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.ui.accueil.HomeActivity;
import com.google.firebase.auth.FirebaseUser;

import java.util.Objects;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private FirebaseManager firebaseManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();

        // Check if a user is already logged in
        firebaseManager = new FirebaseManager(getApplicationContext());
        FirebaseUser currentUser = firebaseManager.getCurrentUser();

        Log.d("email", currentUser != null ? currentUser.getEmail() : "No user");
        if (currentUser != null) {
            // User is already logged in, navigate to HomeActivity
            Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
            startActivity(intent);
            finish(); // Close LoginActivity so the user can't go back to it
        } else {
            // Set up login button click listener if no user is logged in
            binding.loginBtn.setOnClickListener(e -> {
                String email = binding.edtEmail.getText().toString().trim();
                String password = binding.edtPassword.getText().toString().trim();
                if(email.isEmpty() || password.isEmpty())
                    Toast.makeText(LoginActivity.this, "SVP entrer votre email et votre mot de passe", Toast.LENGTH_SHORT  ).show();
                else
                    connecter(email, password);

            });
            binding.tvRegister.setOnClickListener(e -> {
                versRegister();
            });
            binding.tvOublie.setOnClickListener(e -> {
                versOublie();
            });
       }
    }

    private void versRegister(){
        Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
        startActivity(intent);
    }
    private void versOublie(){
        Intent intent = new Intent(LoginActivity.this, OublieActivity.class);
        startActivity(intent);
    }

    private void connecter(String email, String password) {
        firebaseManager.signIn(email, password, new FirebaseManager.SignInCallback() {
            @Override
            public void onSuccess(FirebaseUser user) {
                Log.d("HomeActivity", "Connexion réussie");

                // Sauvegarder le mot de passe dans SharedPreferences
                SharedPreferences sharedPreferences = getSharedPreferences("AppPreferences", MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("userEmail", email);
                editor.putString("userPassword", password); // Sauvegarder le mot de passe
                editor.apply();

                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                startActivity(intent);
                finish(); // Fermer LoginActivity pour empêcher l'utilisateur de revenir
            }

            @Override
            public void onFailure(Exception e) {
                Log.w("HomeActivity", "Échec de la connexion", e);
                binding.tvIncorect.setVisibility(View.VISIBLE);
            }
        });
    }

}