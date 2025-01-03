package com.example.appmobile.view.connexion;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityRegisterBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ParentManager;
import com.example.appmobile.model.firebase.interfaces.ValueExistCallback;
import com.example.appmobile.utils.SendEmailTask;
import com.example.appmobile.utils.UperName;

import java.util.Random;

public class RegisterActivity extends AppCompatActivity {
    private ActivityRegisterBinding binding;
    private FirebaseManager firebaseManager;
    private ParentManager parentManager;

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
            String nom= UperName.capitalizeFirstLetter(binding.nomEdt.getText().toString().trim());
            String prenom=UperName.capitalizeFirstLetter(binding.prenomEdt.getText().toString().trim());
            String email=UperName.capitalizeFirstLetter(binding.emailEdt.getText().toString().trim());
            String password=UperName.capitalizeFirstLetter(binding.passwordEdt.getText().toString().trim());

            validerChamps(nom,prenom,email,password);
            verify(nom,prenom,email,password);

        });

    }
    private void verify(String nom,String prenom,String email,String password) {
        firebaseManager = new FirebaseManager(getApplicationContext());
        parentManager =new ParentManager(getApplicationContext());
        parentManager.isEmailExist(email, new ValueExistCallback() {
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