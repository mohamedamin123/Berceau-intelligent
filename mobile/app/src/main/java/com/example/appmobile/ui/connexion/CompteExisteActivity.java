package com.example.appmobile.ui.connexion;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityCompteExisteBinding;
import com.example.appmobile.databinding.ActivityConfirmerEmailBinding;

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