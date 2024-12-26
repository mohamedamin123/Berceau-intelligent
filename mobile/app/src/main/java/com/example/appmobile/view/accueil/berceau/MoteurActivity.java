package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityMoteurBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class MoteurActivity extends AppCompatActivity {

    private ActivityMoteurBinding binding;
    private ServoMoteurManager moteurManager;
    private String id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMoteurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        moteurManager = new ServoMoteurManager(currentUser);
        id = getIntent().getStringExtra("id");

        getMode();


        // Bouton pour retourner à l'activité précédente
        binding.btnRetour.setOnClickListener(e -> finish());

        // Bouton pour fermer le moteur
        binding.btnFermer.setOnClickListener(e -> {
            if(getMode().equals("Auto")) {
                Toast.makeText(getApplicationContext(),"Change mode pour fermer",Toast.LENGTH_SHORT).show();
            }else {
                moteurManager.setEtat(id, false, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(),"fermer bouger",Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(),"erreur dans fermer bouger",Toast.LENGTH_SHORT).show();

                    }
                });
            }
        });

        // Bouton pour ouvrir le moteur
        binding.btnOuvrir.setOnClickListener(e -> {
            if(getMode().equals("Auto")) {
                Toast.makeText(getApplicationContext(),"Change mode pour fermer",Toast.LENGTH_SHORT).show();
            }else {
                moteurManager.setEtat(id, true, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(),"fermer bouger",Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(),"erreur dans fermer bouger",Toast.LENGTH_SHORT).show();

                    }
                });
            }
        });

        // Bouton pour changer le mode du moteur
        binding.btnMode.setOnClickListener(e -> {
            String mode;
            if(getMode().equals("Auto")) {
                mode="Manuelle";
            }else {
                mode="Auto";
            }
            moteurManager.changeMode(id, mode, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    Toast.makeText(getApplicationContext(),"le mode est change devient "+mode, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(getApplicationContext(),"erreur dans change de mode", Toast.LENGTH_SHORT).show();

                }
            });
        });
    }

    // Méthode pour récupérer l'état du moteur

    // Méthode pour récupérer le mode du moteur
    private String getMode() {
        final String[] mode = {""};
        moteurManager.getMode(id, new ServoMoteurManager.ServoValueCallback<String>() {
            @Override
            public void onValueReceived(String value) {
                mode[0] = value;
                Toast.makeText(getApplicationContext(), "Mode actuel : " + value, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(getApplicationContext(), "Erreur lors de la récupération du mode.", Toast.LENGTH_SHORT).show();
            }
        });
        return mode[0];
    }
}
