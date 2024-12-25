package com.example.appmobile.view.accueil.camera;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityConsulterClimatiseurBinding;

public class ConsulterClimatiseurActivity extends AppCompatActivity {

    private ActivityConsulterClimatiseurBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsulterClimatiseurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();

    }
}