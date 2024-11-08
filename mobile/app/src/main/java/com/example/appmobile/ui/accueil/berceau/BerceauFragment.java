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

import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.firebase.DHT11Manager;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.firebase.LedManager;
import com.example.appmobile.firebase.LedValueCallback;
import com.example.appmobile.firebase.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class BerceauFragment extends Fragment {
    private LedManager ledManager ;
    private DHT11Manager dht11Manager ;


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
        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.clm.startAnimation(animation);
        binding.lmp.startAnimation(animation);

        // Continuous update for LED button
        ledManager.getLedValue(new LedValueCallback() {
            @Override
            public void onValueReceived(Integer value) {
                if(binding!=null)
                    binding.lmpBtn.setText(value == 1 ? "Fermer" : "Ouvrir");
            }

            @Override
            public void onValueReceived(Float value) {

            }

            @Override
            public void onFailure(Exception e) {
                Log.e("BerceauFragment", "Erreur lors de la récupération de la valeur LED", e);
            }
        });

        // Set button click listener to toggle LED value
        binding.lmpBtn.setOnClickListener(e -> {
            int newValue = binding.lmpBtn.getText().toString().equals("Ouvrir") ? 1 : 0;
            ledManager.setLedValue(newValue, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    if(binding!=null)
                        binding.lmpBtn.setText(newValue == 1 ? "Fermer" : "Ouvrir");
                }

                @Override
                public void onFailure(Exception e) {
                    Log.e("BerceauFragment", "Erreur lors de la mise à jour de la valeur LED", e);
                }
            });
        });

        // Set up continuous listeners for temperature and humidity
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

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}