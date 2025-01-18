package com.example.appmobile.controller.berceau;

import android.view.View;
import android.widget.SeekBar;
import android.widget.Toast;
import com.example.appmobile.databinding.ActivityLumiereBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.view.accueil.berceau.LumiereActivity;
import com.google.firebase.auth.FirebaseUser;

public class LumiereController implements View.OnClickListener {

    private LumiereActivity activity;
    private ActivityLumiereBinding binding;
    private LedManager ledManager;
    private String id;

    public LumiereController(LumiereActivity activity, ActivityLumiereBinding binding) {
        this.activity = activity;
        this.binding = binding;
        this.id = activity.getIntent().getStringExtra("id");
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        ledManager = new LedManager(currentUser);
        setupListeners();
    }

    private void setupListeners() {
        binding.btnOuvrir.setOnClickListener(v -> ouvrirLumiere());
        binding.btnFermer.setOnClickListener(v -> fermerLumiere());
        binding.seekBarIntensite.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ledManager.changeIntensite(id, progress, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(activity, "Intensité mise à jour", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(activity, "Erreur dans l'ajustement de l'intensité", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}
            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });

        binding.btnRetour.setOnClickListener(v -> activity.finish());
    }

    private void ouvrirLumiere() {
        ledManager.ouvrirLed(id, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                Toast.makeText(activity, "Lumière allumée", Toast.LENGTH_SHORT).show();
                binding.seekBarIntensite.setProgress(1023);
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(activity, "Erreur d'allumage", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void fermerLumiere() {
        ledManager.fermerLed(id, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                Toast.makeText(activity, "Lumière éteinte", Toast.LENGTH_SHORT).show();
                binding.seekBarIntensite.setProgress(0);
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(activity, "Erreur d'extinction", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onClick(View v) {
        // Gérer d'autres actions si nécessaire
    }
}
