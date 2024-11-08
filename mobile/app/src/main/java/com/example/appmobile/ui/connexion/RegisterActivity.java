package com.example.appmobile.ui.connexion;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityLoginBinding;
import com.example.appmobile.databinding.ActivityRegisterBinding;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.utils.SendEmailTask;
import com.google.firebase.auth.FirebaseUser;

import java.util.Random;

public class RegisterActivity extends AppCompatActivity {
    private ActivityRegisterBinding binding;
    private FirebaseManager firebaseManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();

        binding.loginBtn.setOnClickListener(e->{
            String nom=binding.nomEdt.getText().toString().trim();
            String prenom=binding.prenomEdt.getText().toString().trim();
            String email=binding.emailEdt.getText().toString().trim();
            String password=binding.passwordEdt.getText().toString().trim();

            validerChamps(nom,prenom,email,password);
            verify(nom,prenom,email,password);

        });

    }
    private void verify(String nom,String prenom,String email,String password) {
        firebaseManager = new FirebaseManager(getApplicationContext());
        firebaseManager.isEmailExist(email, new FirebaseManager.EmailExistCallback() {
            @Override
            public void onCheckComplete(boolean exists) {
                if(exists) {
                    Intent intent = new Intent(RegisterActivity.this, CompteExisteActivity.class);
                    intent.putExtra("nom",nom);
                    intent.putExtra("prenom",prenom);
                    intent.putExtra("email",email);
                    startActivity(intent);
                } else {
                    save(nom,prenom,email,password);
                }
            }
        });

    }
    private void validerChamps(String nom, String prenom,String email, String password) {
        if(nom.isEmpty()) {
            binding.errorNomPrenom.setText("Les champs nom et prenom sont obligatoire");
            return;
        }
        if(prenom.isEmpty()) {
            binding.errorNomPrenom.setText("Les champs nom et prenom sont obligatoire");
            return;
        }
        if(password.isEmpty()) {
            binding.errorPassword.setText("Le champs mot de passe est obligatoire");
            return;
        }
        if(email.isEmpty()) {
            binding.errorEmail.setText("Le champs email est obligatoire");
            return;
        }
    }

    private void save(String nom ,String prenom, String email, String password) {
        String verificationCode = String.format("%06d", new Random().nextInt(1000000));


        Intent intent = new Intent(RegisterActivity.this, ConfirmerEmailActivity.class);
        intent.putExtra("nom", nom);
        intent.putExtra("prenom", prenom);
        intent.putExtra("email", email);
        intent.putExtra("password", password);
        intent.putExtra("code", verificationCode);
        intent.putExtra("page", 1);

        startActivity(intent);
        //send email
        new SendEmailTask(this).execute(email, verificationCode);

    }


}