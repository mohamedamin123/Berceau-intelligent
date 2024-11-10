package com.example.appmobile.ui.accueil.berceau;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.appmobile.R;
import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.firebase.ClimatiseurManager;
import com.example.appmobile.firebase.DHT11Manager;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.firebase.LedManager;
import com.example.appmobile.firebase.LedValueCallback;
import com.example.appmobile.firebase.ServoMoteurManager;
import com.example.appmobile.firebase.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class BerceauFragment extends Fragment {
    private LedManager ledManager ;
    private DHT11Manager dht11Manager ;
    private ServoMoteurManager servoMoteur;
    private ClimatiseurManager climatiseurManager;


    private FragmentBerceauBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentBerceauBinding.inflate(inflater, container, false);

        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        dht11Manager=new DHT11Manager(currentUser);
        ledManager = new LedManager(currentUser);
        servoMoteur=new ServoMoteurManager(currentUser);
        climatiseurManager=new ClimatiseurManager(currentUser);

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.clm.startAnimation(animation);
        binding.lmp.startAnimation(animation);
        binding.mvt.startAnimation(animation);
        // Continuous update for LED button

        getLed();

        getCLim();
        getTMP();

        getHMD();

        getServo();


        binding.clmBtn.setOnClickListener(e->{
            changeClim();
        });

        binding.mvtBtn.setOnClickListener(e->{
       changeServo();

        });

        // Set button click listener to toggle LED value
        binding.lmpBtn.setOnClickListener(e -> {
          changeLed();
        });


    }

    private void getServo() {
        servoMoteur.getServoValue(new ServoMoteurManager.ServoValueCallback() {
            @Override
            public void onValueReceived(Boolean value) {
                if(binding!=null)
                    binding.mvtBtn.setText(value ? getString(R.string.arreter) : getString(R.string.bouger) );
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
                if(binding!=null)
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
                if(binding!=null)
                    binding.clmBtn.setText(value ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {

            }
        });
    }

    private void getTMP() {
        dht11Manager.listenToTmpValue(new LedValueCallback() {
            @Override
            public void onValueReceived(Integer value) {

            }

            @Override
            public void onValueReceived(Float value) {
                if(binding!=null)
                    binding.tmpEdt.setText(value != null ? value + " °C" : "N/A");
            }

            @Override
            public void onFailure(Exception e) {
                if(binding!=null)
                    binding.tmpEdt.setText("Error: " + e.getMessage());
            }
        });
    }

    private void getHMD() {
        dht11Manager.listenToHmdValue(new LedValueCallback() {
            @Override
            public void onValueReceived(Integer value) {

            }

            @Override
            public void onValueReceived(Float value) {
                if(binding!=null)
                    binding.hmdEdt.setText(value != null ? value + " %" : "N/A");
            }

            @Override
            public void onFailure(Exception e) {
                if(binding!=null)
                    binding.hmdEdt.setText("Error: " + e.getMessage());
            }
        });
    }

    private void changeServo() {
        boolean newValue = binding.mvtBtn.getText().toString().equals(getString(R.string.arreter));


        if(newValue) {
            servoMoteur.setServoValue(false, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    binding.mvtBtn.setText(getString(R.string.bouger));
                }

                @Override
                public void onFailure(Exception e) {

                }
            });
        } else  {
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

    private void changeClim() {
        Boolean newValue = binding.clmBtn.getText().toString().equals("Ouvrir");
        climatiseurManager.setClimValue(newValue, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                if(binding!=null)
                    binding.clmBtn.setText(newValue ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {
                Log.e("BerceauFragment", "Erreur lors de la mise à jour de la valeur LED", e);
            }
        });
    }

    private void changeLed() {
        Boolean newValue = binding.lmpBtn.getText().toString().equals("Ouvrir");
        ledManager.setLedValue(newValue, new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                if(binding!=null)
                    binding.lmpBtn.setText(newValue ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onFailure(Exception e) {
                Log.e("BerceauFragment", "Erreur lors de la mise à jour de la valeur LED", e);
            }
        });
    }



    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}