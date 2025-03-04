package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.controller.berceau.CameraController;
import com.example.appmobile.databinding.ActivityCameraBinding;

public class CameraActivity extends AppCompatActivity {
    private ActivityCameraBinding binding;
    private CameraController controller;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCameraBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        controller=new CameraController(this,this.binding);
        controller.startVideoStream();
    }
}
