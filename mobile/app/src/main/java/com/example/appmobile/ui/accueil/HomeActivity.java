package com.example.appmobile.ui.accueil;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityHomeBinding;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.ui.welcome.WelcomeActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseUser;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.NavigationUI;

public class HomeActivity extends AppCompatActivity {

    private ActivityHomeBinding binding;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialisez les préférences partagées pour vérifier la première ouverture
        SharedPreferences preferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        boolean isFirstRun = preferences.getBoolean("isFirstRun", true);

        if (isFirstRun) {
            // Mettez à jour les préférences pour indiquer que l'application a été ouverte
            SharedPreferences.Editor editor = preferences.edit();
            editor.putBoolean("isFirstRun", false);
            editor.apply();

            // Ouvrir l'activité de bienvenue si c'est la première fois
            Intent intent = new Intent(HomeActivity.this, WelcomeActivity.class);
            startActivity(intent);
            finish(); // Terminez HomeActivity pour éviter un retour en arrière
            return; // Arrêtez l'exécution ici pour éviter de continuer dans HomeActivity
        }

        // Chargez le layout normal de HomeActivity si ce n'est pas la première ouverture
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        BottomNavigationView navView = findViewById(R.id.nav_view);

        // Configurez NavController avec BottomNavigationView
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_homme);
        NavigationUI.setupWithNavController(navView, navController);
    }
}
