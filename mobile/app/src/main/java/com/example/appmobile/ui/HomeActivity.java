package com.example.appmobile.ui;

import android.os.Bundle;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityHomeBinding;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.NavigationUI;

public class HomeActivity extends AppCompatActivity {

    private ActivityHomeBinding binding;

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
    }
}
