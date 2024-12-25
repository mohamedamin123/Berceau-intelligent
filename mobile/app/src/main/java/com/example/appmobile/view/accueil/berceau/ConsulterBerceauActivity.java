package com.example.appmobile.view.accueil.berceau;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.animation.TranslateAnimation;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityCompteExisteBinding;
import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.model.firebase.ClimatiseurManager;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class ConsulterBerceauActivity extends AppCompatActivity {
    private ActivityConsulterBerceauBinding binding;
    private LedManager ledManager ;
    private DHTManager dhtManager;
    private ServoMoteurManager servoMoteur;
    private ClimatiseurManager climatiseurManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityConsulterBerceauBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();

        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        dhtManager = new DHTManager(currentUser);
        ledManager = new LedManager(currentUser);
        servoMoteur = new ServoMoteurManager(currentUser);
        climatiseurManager = new ClimatiseurManager(currentUser);

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.lmp.startAnimation(animation);
        binding.mvt.startAnimation(animation);
        // Continuous update for LED button

//        getLed();
//
//        getCLim();
//        getTMP();
//
//        getHMD();
//
//        getServo();

        binding.mvtBtn.setOnClickListener(e -> {
            //changeServo();
            Intent intent = new Intent(this, MoteurActivity.class);
            startActivity(intent);
        });

        // Set button click listener to toggle LED value
        binding.lmpBtn.setOnClickListener(e -> {
            //changeLed();
            Intent intent = new Intent(this, LumiereActivity.class);
            startActivity(intent);
        });


    }

    private void getServo() {
        servoMoteur.getServoValue(new ServoMoteurManager.ServoValueCallback() {
            @Override
            public void onValueReceived(Boolean value) {
                if (binding != null)
                    binding.mvtBtn.setText(value ? getString(R.string.arreter) : getString(R.string.bouger));
            }

            @Override
            public void onFailure(Exception e) {

            }
        });
    }

    private void getLed() {
        ledManager.getLedValue(new LedManager.LedValueCallback() {
            @Override
            public void onValueReceived(Boolean value) {
                if (binding != null)
                    binding.lmpBtn.setText(value ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {
                Log.e("BerceauFragment", "Erreur lors de la récupération de la valeur LED", e);
            }
        });
    }

    private void getCLim() {
        climatiseurManager.getClimValue(new ClimatiseurManager.CLimValueCallback() {
            @Override
            public void onValueReceived(Boolean value) {
//                if(binding!=null)
//                    binding.clmBtn.setText(value ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {

            }
        });
    }

    private void getTMP() {
        dhtManager.listenToTmpValue(new GetValueCallback<Float>() {

            @Override
            public void onValueReceived(Float value) {
                if (binding != null)
                    binding.tmpEdt.setText(value != null ? value + " °C" : "N/A");
            }

            @Override
            public void onFailure(Exception e) {
                if (binding != null)
                    binding.tmpEdt.setText("Error: " + e.getMessage());
            }
        });
    }

    private void getHMD() {
        dhtManager.listenToHmdValue(new GetValueCallback<Float>() {


            @Override
            public void onValueReceived(Float value) {
                if (binding != null)
                    binding.hmdEdt.setText(value != null ? value + " %" : "N/A");
            }

            @Override
            public void onFailure(Exception e) {
                if (binding != null)
                    binding.hmdEdt.setText("Error: " + e.getMessage());
            }
        });
    }

    private void changeServo() {
        boolean newValue = binding.mvtBtn.getText().toString().equals(getString(R.string.arreter));


        if (newValue) {
            servoMoteur.setServoValue(false, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    binding.mvtBtn.setText(getString(R.string.bouger));
                }

                @Override
                public void onFailure(Exception e) {

                }
            });
        } else {
            servoMoteur.setServoValue(true, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    binding.mvtBtn.setText(getString(R.string.arreter));
                }

                @Override
                public void onFailure(Exception e) {

                }
            });
        }
    }


    private void changeLed() {
        Boolean newValue = binding.lmpBtn.getText().toString().equals("Ouvrir");
        ledManager.setLedValue(newValue, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                if (binding != null)
                    binding.lmpBtn.setText(newValue ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {
                Log.e("BerceauFragment", "Erreur lors de la mise à jour de la valeur LED", e);
            }
        });
    }

}
