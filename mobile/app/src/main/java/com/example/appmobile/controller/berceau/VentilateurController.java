

package com.example.appmobile.controller.berceau;

import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;
import androidx.annotation.NonNull;

import com.example.appmobile.databinding.ActivityConsulterVentilateurBinding;
import com.example.appmobile.model.firebase.VentilateurManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.view.accueil.berceau.ConsulterVentilateurActivity;
import com.google.firebase.auth.FirebaseUser;

public class VentilateurController {

    private ConsulterVentilateurActivity activity;
    private ActivityConsulterVentilateurBinding binding;
    private VentilateurManager ventilateurManager;
    private String id;
    private String currentMode = "";

    public VentilateurController(@NonNull ConsulterVentilateurActivity activity, @NonNull ActivityConsulterVentilateurBinding binding, @NonNull String id) {
        this.activity = activity;
        this.binding = binding;
        this.id = id;

        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        ventilateurManager = new VentilateurManager(currentUser);

        fetchMode();
        setupListeners();
    }

    private void setupListeners() {
        binding.btnRetour.setOnClickListener(v -> {
            if (binding.etTemperature.getText().toString().isEmpty()) {
                showToast("Veuillez saisir une température valide");
                return;
            }
            activity.finish();
        });

        binding.btnMode.setOnClickListener(v -> changeMode());
        binding.btnOuvrir.setOnClickListener(v -> openVentilator());
        binding.btnFermer.setOnClickListener(v -> closeVentilator());

        binding.etTemperature.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (count > 0) {
                    ventilateurManager.changeTmpSouhaite(id, Integer.valueOf(binding.etTemperature.getText().toString()), new UpdateValueCallback() {
                        @Override
                        public void onSuccess() {}

                        @Override
                        public void onFailure(Exception e) {}
                    });
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void changeMode() {
        String newMode = "Automatique".equals(currentMode) ? "Manuelle" : "Automatique";
        binding.btnMode.setText("Mode : " + newMode);

        ventilateurManager.changeMode(id, newMode, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                currentMode = newMode;
                showToast("Le mode est changé en : " + newMode);
            }

            @Override
            public void onFailure(Exception e) {
                showToast("Erreur lors du changement de mode");
            }
        });
    }

    private void openVentilator() {
        if ("Automatique".equals(currentMode)) {
            showToast("Changez le mode pour ouvrir");
        } else {
            ventilateurManager.setEtat(id, true, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    showToast("Ventilateur ouvert");
                }

                @Override
                public void onFailure(Exception e) {
                    showToast("Erreur lors de l'ouverture du ventilateur");
                }
            });
        }
    }

    private void closeVentilator() {
        if ("Automatique".equals(currentMode)) {
            showToast("Changez le mode pour fermer");
        } else {
            ventilateurManager.setEtat(id, false, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    showToast("Ventilateur fermé");
                }

                @Override
                public void onFailure(Exception e) {
                    showToast("Erreur lors de la fermeture du Ventilateur");
                }
            });
        }
    }

    private void fetchMode() {
        ventilateurManager.getMode(id, new VentilateurManager.VentilateurValueCallback<String>() {
            @Override
            public void onValueReceived(String value) {
                currentMode = value;
                binding.btnMode.setText("Mode : " + currentMode);
            }

            @Override
            public void onFailure(Exception e) {}
        });

        ventilateurManager.getTmpSouhaite(id, new VentilateurManager.VentilateurValueCallback<Integer>() {
            @Override
            public void onValueReceived(Integer value) {
                if (value != null) {
                    binding.etTemperature.setText(String.valueOf(value));
                }
            }

            @Override
            public void onFailure(Exception e) {}
        });
    }

    private void showToast(String message) {
        Toast.makeText(activity.getApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }
}
