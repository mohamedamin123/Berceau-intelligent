package com.example.appmobile.view.accueil.berceau;

import android.annotation.SuppressLint;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityMoteurBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.controller.berceau.MoteurController;
import com.google.firebase.auth.FirebaseUser;

public class MoteurActivity extends AppCompatActivity {

    private ActivityMoteurBinding binding;
    private ServoMoteurManager moteurManager;
    private String id;
    private MoteurController controller;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMoteurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Récupération de l'ID passé
        id = getIntent().getStringExtra("id");

        // Initialisation du contrôleur
        controller = new MoteurController(this, binding, id);
    }
}
