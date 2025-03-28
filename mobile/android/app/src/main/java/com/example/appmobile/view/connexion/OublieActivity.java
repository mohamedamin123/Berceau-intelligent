package com.example.appmobile.view.connexion;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityOublieBinding;
import com.example.appmobile.utils.SendEmailTask;

import java.util.Random;

public class OublieActivity extends AppCompatActivity {
    private ActivityOublieBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOublieBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        String verificationCode = String.format("%06d", new Random().nextInt(1000000));
        binding.loginBtn.setOnClickListener(e -> {
           String email=binding.edtEmail.getText().toString().trim();
           if(!email.isEmpty()) {

               Intent intent = new Intent(OublieActivity.this, ConfirmerEmailActivity.class);
               intent.putExtra("code", verificationCode);
               intent.putExtra("email", email);
               intent.putExtra("page", 2);
               startActivity(intent);
               new SendEmailTask(this).execute(email, verificationCode);

           }
        });
    }
}