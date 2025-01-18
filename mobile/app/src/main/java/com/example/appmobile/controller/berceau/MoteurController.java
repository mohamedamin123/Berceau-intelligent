package com.example.appmobile.controller.berceau;

import android.view.View;
import android.widget.Toast;

import com.example.appmobile.databinding.ActivityMoteurBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.view.accueil.berceau.MoteurActivity;
import com.google.firebase.auth.FirebaseUser;

public class MoteurController implements View.OnClickListener {

    private final MoteurActivity activity;
    private final ActivityMoteurBinding binding;
    private final ServoMoteurManager moteurManager;
    private final String id;
    private String currentMode = "";

    public MoteurController(MoteurActivity activity, ActivityMoteurBinding binding, String id) {
        this.activity = activity;
        this.binding = binding;
        this.id = id;
        FirebaseUser currentUser = new FirebaseManager().getCurrentUser();
        moteurManager = new ServoMoteurManager(currentUser);
        setListener();


        fetchMode();
    }


    @Override
    public void onClick(View v) {
        if (v == binding.btnRetour) {
            activity.finish();
        } else if (v == binding.btnFermer) {
            handleMoteurAction(false, "Moteur fermé", "Erreur lors de la fermeture");
        } else if (v == binding.btnOuvrir) {
            handleMoteurAction(true, "Moteur ouvert", "Erreur lors de l'ouverture");
        } else if (v == binding.btnMode) {
            toggleMode();
        }
    }

    private void setListener() {
        // Configuration des écouteurs d'événements
        binding.btnRetour.setOnClickListener(this);
        binding.btnFermer.setOnClickListener(this);
        binding.btnOuvrir.setOnClickListener(this);
        binding.btnMode.setOnClickListener(this);
    }


    private void fetchMode() {
        moteurManager.getMode(id, new ServoMoteurManager.ServoValueCallback<String>() {
            @Override
            public void onValueReceived(String value) {
                currentMode = value;
                binding.btnMode.setText("Mode : " + currentMode);
            }

            @Override
            public void onFailure(Exception e) {
                showToast("Erreur lors de la récupération du mode");
            }
        });
    }

    private void handleMoteurAction(boolean ouvrir, String successMsg, String errorMsg) {
        if ("Automatique".equals(currentMode)) {
            showToast("Changez le mode pour effectuer cette action");
            return;
        }
        moteurManager.setEtat(id, ouvrir, getCallback(successMsg, errorMsg));
    }

    private void toggleMode() {
        String newMode = "Automatique".equals(currentMode) ? "Manuelle" : "Automatique";
        binding.btnMode.setText("Mode : " + newMode);
        moteurManager.changeMode(id, newMode, getCallback("Mode changé", "Erreur de changement"));
    }

    private UpdateValueCallback getCallback(String successMsg, String errorMsg) {
        return new UpdateValueCallback() {
            @Override
            public void onSuccess() { showToast(successMsg); }
            @Override
            public void onFailure(Exception e) { showToast(errorMsg); }
        };
    }

    private void showToast(String message) {
        Toast.makeText(activity.getApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }
}
