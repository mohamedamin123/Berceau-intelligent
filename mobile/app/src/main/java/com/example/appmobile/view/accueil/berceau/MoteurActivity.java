package com.example.appmobile.view.accueil.berceau;

import android.annotation.SuppressLint;
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
    private String currentMode = ""; // Stocke le mode actuel

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMoteurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onStart() {
        super.onStart();
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        moteurManager = new ServoMoteurManager(currentUser);
        id = getIntent().getStringExtra("id");

        // Récupérer le mode actuel au démarrage
        fetchMode();

        // Bouton pour retourner à l'activité précédente
        binding.btnRetour.setOnClickListener(e -> finish());

        // Bouton pour fermer le moteur
        binding.btnFermer.setOnClickListener(e -> {
            if ("Automatique".equals(currentMode)) {
                Toast.makeText(getApplicationContext(), "Changez le mode pour fermer", Toast.LENGTH_SHORT).show();
            } else {
                moteurManager.setEtat(id, false, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(), "Moteur fermé", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(), "Erreur lors de la fermeture du moteur", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        // Bouton pour ouvrir le moteur
        binding.btnOuvrir.setOnClickListener(e -> {
            if ("Automatique".equals(currentMode)) {
                Toast.makeText(getApplicationContext(), "Changez le mode pour ouvrir", Toast.LENGTH_SHORT).show();
            } else {
                moteurManager.setEtat(id, true, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(), "Moteur ouvert", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(), "Erreur lors de l'ouverture du moteur", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        // Bouton pour changer le mode du moteur
        binding.btnMode.setOnClickListener(e -> {
            String newMode = "Automatique".equals(currentMode) ? "Manuelle" : "Automatique";
            binding.btnMode.setText("Mode : " + newMode);

            moteurManager.changeMode(id, newMode, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    currentMode = newMode; // Mettez à jour le mode localement
                    Toast.makeText(getApplicationContext(), "Le mode est changé en : " + newMode, Toast.LENGTH_SHORT).show();

                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(getApplicationContext(), "Erreur lors du changement de mode", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }

    // Méthode pour récupérer le mode du moteur
    private void fetchMode() {
        moteurManager.getMode(id, new ServoMoteurManager.ServoValueCallback<String>() {
            @Override
            public void onValueReceived(String value) {
                currentMode = value; // Mettez à jour le mode actuel
                binding.btnMode.setText("Mode : " + currentMode);

            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(getApplicationContext(), "Erreur lors de la récupération du mode.", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
