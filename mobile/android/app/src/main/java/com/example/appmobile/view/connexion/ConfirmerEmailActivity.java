package com.example.appmobile.view.connexion;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityConfirmerEmailBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ParentManager;
import com.example.appmobile.model.firebase.interfaces.SignInCallback;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.utils.SendEmailTask;
import com.google.firebase.auth.FirebaseUser;

public class ConfirmerEmailActivity extends AppCompatActivity {
    private ActivityConfirmerEmailBinding binding;
    String nom,prenom,email,password,verificationCode;
    private FirebaseManager firebaseManager;
    private ParentManager parentManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConfirmerEmailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        // Retrieve the email and verification code from the intent
         email = getIntent().getStringExtra("email");
         nom = getIntent().getStringExtra("nom");
         prenom = getIntent().getStringExtra("prenom");
         password = getIntent().getStringExtra("password");
         verificationCode = getIntent().getStringExtra("code");
    }

    @Override
    protected void onStart() {
        super.onStart();
        int page = getIntent().getIntExtra("page",-1);
        binding.loginBtn.setOnClickListener(e->{
            String codeSaisir=binding.confirmcodeET.getText().toString().trim();

            if(codeSaisir.equals(verificationCode)) {
                if(page==1){
                    enregistrer();
                }else if(page==2) {
                    oublier();
                }
            }else {
                Toast.makeText(ConfirmerEmailActivity.this,"Votre code inccorect ",Toast.LENGTH_SHORT).show();
            }
        });

        binding.confirmagainTv.setOnClickListener(e->{

            //send email
            new SendEmailTask(ConfirmerEmailActivity.this).execute(email, verificationCode);
        });


    }

    private void oublier() {
        if (email != null && !email.isEmpty()) {
            firebaseManager = new FirebaseManager(getApplicationContext());
            parentManager =new ParentManager(getApplicationContext());
            // Envoi d'un email de réinitialisation du mot de passe
            parentManager.sendPasswordResetEmail(email, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    Toast.makeText(ConfirmerEmailActivity.this, "Email de réinitialisation envoyé. Vérifiez votre boîte de réception.", Toast.LENGTH_SHORT).show();
                    // Vous pouvez rediriger l'utilisateur vers une autre page ou simplement lui indiquer que tout va bien
                    Intent intent = new Intent(ConfirmerEmailActivity.this, LoginActivity.class);
                    startActivity(intent);
                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(ConfirmerEmailActivity.this, "Erreur lors de l'envoi de l'email de réinitialisation.", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void enregistrer() {
        Intent intent=new Intent(ConfirmerEmailActivity.this, LoginActivity.class);
        firebaseManager = new FirebaseManager(getApplicationContext());
        parentManager =new ParentManager(getApplicationContext());
        parentManager.signUp(email, password, nom, prenom, new SignInCallback() {
            @Override
            public void onSuccess(FirebaseUser user) {

                // Handle successful sign-up, navigate to the next activity or show a success message
                startActivity(intent);
            }

            @Override
            public void onFailure(Exception e) {
                // Handle sign-up failure, show an error message
                Toast.makeText(ConfirmerEmailActivity.this,"Il y'a erreur dans connexion ",Toast.LENGTH_SHORT).show();
            }
        });
    }
}