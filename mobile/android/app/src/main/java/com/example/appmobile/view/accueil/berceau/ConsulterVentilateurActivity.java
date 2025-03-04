package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import com.example.appmobile.databinding.ActivityConsulterVentilateurBinding;
import com.example.appmobile.controller.berceau.VentilateurController;
import com.example.appmobile.databinding.ActivityConsulterVentilateurBinding;

public class ConsulterVentilateurActivity extends AppCompatActivity {

    private ActivityConsulterVentilateurBinding binding;
    private VentilateurController ventilateurController;
    private String id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsulterVentilateurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        id = getIntent().getStringExtra("id");
        ventilateurController = new VentilateurController(this, binding, id);
    }
}