package com.example.appmobile;

import android.os.Bundle;
import android.util.Log;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        binding.camera.setOnClickListener(e->{
            Log.d("button","Camera");
        });
        binding.bebe.setOnClickListener(e->{
            Log.d("button","Bebe");

        });
        binding.client.setOnClickListener(e->{
            Log.d("button","Client");

        });
        binding.berceau.setOnClickListener(e->{
            Log.d("button","Berceau");
        });
    }
}