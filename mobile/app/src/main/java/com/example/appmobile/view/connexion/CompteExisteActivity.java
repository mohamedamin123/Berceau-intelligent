package com.example.appmobile.view.connexion;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityCompteExisteBinding;

public class CompteExisteActivity extends AppCompatActivity {
    private ActivityCompteExisteBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCompteExisteBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
       String email = getIntent().getStringExtra("email");
        String nom = getIntent().getStringExtra("nom");
        String prenom = getIntent().getStringExtra("prenom");

        binding.accountExistsEmail.setText(email);
        binding.accountExistsName.setText(prenom +" "+nom);


        binding.tvOublie.setOnClickListener(e->{
            Intent intent = new Intent(this,OublieActivity.class);
            startActivity(intent);
        });

        binding.tvRegister.setOnClickListener(e->{
            Intent intent = new Intent(this,RegisterActivity.class);
            startActivity(intent);
        });

        binding.tvConnecter.setOnClickListener(e->{
            Intent intent = new Intent(this,LoginActivity.class);
            startActivity(intent);
        });

    }
}