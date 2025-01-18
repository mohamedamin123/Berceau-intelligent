package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;
import android.view.animation.TranslateAnimation;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.controller.berceau.ConsulterBerceauController;
import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.model.entity.Berceau;

public class ConsulterBerceauActivity extends AppCompatActivity {
    private ActivityConsulterBerceauBinding binding;
    private ConsulterBerceauController controller;
    private String id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsulterBerceauBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        id = getIntent().getStringExtra("id");
        Berceau berceau = (Berceau) getIntent().getSerializableExtra("berceau");

        // Initialisation du contrôleur avec l'ID
        controller = new ConsulterBerceauController(binding, this, id);

        // Animation des composants
        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.lmp.startAnimation(animation);
        binding.mvt.startAnimation(animation);
        binding.ventilateur.startAnimation(animation);
        binding.camera.startAnimation(animation);

    }

}
