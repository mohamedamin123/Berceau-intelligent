package com.example.appmobile.ui.welcome;

import android.content.Intent;
import android.os.Bundle;

import com.example.appmobile.R;
import com.example.appmobile.ui.accueil.HomeActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.appmobile.databinding.ActivityWelcomeBinding;

public class WelcomeActivity extends AppCompatActivity {

    private ActivityWelcomeBinding binding;
    private NavController navController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityWelcomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        BottomNavigationView navView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.navigation_welcome1, R.id.navigation_welcome2, R.id.navigation_welcome3)
                .build();
         navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_welcome);


        binding.btnSuivant.setOnClickListener(v -> navigateToNextFragment());
        binding.btnRetour.setOnClickListener(v -> navigateToPreviousFragment());
    }

    private void navigateToNextFragment() {
        int currentDestinationId = navController.getCurrentDestination().getId();

        if (currentDestinationId == R.id.navigation_welcome1) {
            navController.navigate(R.id.navigation_welcome2);
        } else if (currentDestinationId == R.id.navigation_welcome2) {
            navController.navigate(R.id.navigation_welcome3);
        } else if (currentDestinationId == R.id.navigation_welcome3) {
            Intent intent = new Intent(WelcomeActivity.this, HomeActivity.class);
            startActivity(intent);
        }
    }

    private void navigateToPreviousFragment() {
        int currentDestinationId = navController.getCurrentDestination().getId();

        if (currentDestinationId == R.id.navigation_welcome2) {
            navController.navigate(R.id.navigation_welcome1);
        } else if (currentDestinationId == R.id.navigation_welcome3) {
            navController.navigate(R.id.navigation_welcome2);
        }
    }

}