package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityConsulterClimatiseurBinding;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.VentilateurManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class ConsulterClimatiseurActivity extends AppCompatActivity {

    private ActivityConsulterClimatiseurBinding binding;
    private VentilateurManager ventilateurManager;
    String id;
    private String currentMode = ""; // Stocke le mode actuel


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsulterClimatiseurBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        ventilateurManager = new VentilateurManager(currentUser);
        id = getIntent().getStringExtra("id");

        fetchMode();


        binding.btnRetour.setOnClickListener(e->{
            if(binding.etTemperature.getText().toString().isEmpty()) {
                Toast.makeText(getApplicationContext(), "Veuillez saisir une température valide", Toast.LENGTH_SHORT).show();
                return;

            }
            finish();
        });

        binding.btnMode.setOnClickListener(e->{
            String newMode = "Automatique".equals(currentMode) ? "Manuelle" : "Automatique";
            binding.btnMode.setText("Mode : " + newMode);

            ventilateurManager.changeMode(id, newMode, new UpdateValueCallback() {
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
        binding.btnOuvrir.setOnClickListener(e->{
            if ("Automatique".equals(currentMode)) {
                Toast.makeText(getApplicationContext(), "Changez le mode pour ouvrir", Toast.LENGTH_SHORT).show();
            } else {
                ventilateurManager.setEtat(id, true, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(), "Ventilateur ouvert", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(), "Erreur lors de l'ouverture du ventilateur", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
        binding.btnFermer.setOnClickListener(e->{
            if ("Automatique".equals(currentMode)) {
                Toast.makeText(getApplicationContext(), "Changez le mode pour fermer", Toast.LENGTH_SHORT).show();
            } else {
                ventilateurManager.setEtat(id, false, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(), "Ventilateur fermé", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(), "Erreur lors de la fermeture du Ventilateur", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        binding.etTemperature.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (count > 0) {
                    ventilateurManager.changeTmpSouhaite(id, Integer.valueOf(binding.etTemperature.getText().toString()), new UpdateValueCallback() {
                        @Override
                        public void onSuccess() {

                        }

                        @Override
                        public void onFailure(Exception e) {

                        }
                    });
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

    }

    private void fetchMode() {
        ventilateurManager.getMode(id, new VentilateurManager.VentilateurValueCallback<String>() {
            @Override
            public void onValueReceived(String value) {
                currentMode = value; // Mettez à jour le mode actuel
                binding.btnMode.setText("Mode : " + currentMode);
            }

            @Override
            public void onFailure(Exception e) {

            }
        });

        ventilateurManager.getTmpSouhaite(id, new VentilateurManager.VentilateurValueCallback<Integer>() {
            @Override
            public void onValueReceived(Integer value) {
                if(value!=null)
                    binding.etTemperature.setText(String.valueOf(value));
            }

            @Override
            public void onFailure(Exception e) {

            }
        });

    }

}