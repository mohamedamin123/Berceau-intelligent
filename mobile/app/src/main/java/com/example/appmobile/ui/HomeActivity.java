package com.example.appmobile.ui;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityHomeBinding;
import com.example.appmobile.firebase.FirebaseManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseUser;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.NavigationUI;

public class HomeActivity extends AppCompatActivity {

    private ActivityHomeBinding binding;
    private FirebaseManager firebaseManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        BottomNavigationView navView = findViewById(R.id.nav_view);

        // Pass each menu ID as a set of IDs because each menu should be considered as top-level destinations.
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_homme);

        // Set up BottomNavigationView with NavController
        NavigationUI.setupWithNavController(navView, navController);

        // Initialiser FirebaseManager
        firebaseManager = new FirebaseManager();

        // Connexion à Firebase
        firebaseManager.signIn("amin@amin.com", "amin123", new FirebaseManager.SignInCallback() {
            @Override
            public void onSuccess(FirebaseUser user) {
                Log.d("MainActivity", "Connexion réussie");
                // Vous pouvez maintenant interagir avec la base de données

            }

            @Override
            public void onFailure(Exception e) {
                Log.w("MainActivity", "Échec de la connexion", e);
            }
        });
    }



}
