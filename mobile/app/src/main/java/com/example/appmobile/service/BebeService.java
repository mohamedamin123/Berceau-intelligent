package com.example.appmobile.service;

import android.app.IntentService;
import android.content.Intent;
import androidx.annotation.Nullable;

import com.example.appmobile.model.firebase.BebeManager;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class BebeService extends IntentService {

    public BebeService() {
        super("BebeService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        if (intent != null) {
            // Récupérer les paramètres chmp, key et valeur de l'Intent
            String chmp = intent.getStringExtra("chmp");
            String key = intent.getStringExtra("key");
            long valeur = intent.getLongExtra("valeur", 0); // Valeur par défaut 0

            FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
            if (currentUser != null && chmp != null && key != null) {
                BebeManager bebeManager = new BebeManager(currentUser);
                bebeManager.setValue(chmp, key, valeur);
            }
        }
    }
}