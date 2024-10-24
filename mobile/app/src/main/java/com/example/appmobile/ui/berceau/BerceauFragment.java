package com.example.appmobile.ui.berceau;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.firebase.LedManager;
import com.example.appmobile.firebase.LedValueCallback;
import com.example.appmobile.firebase.UpdateValueCallback;

public class BerceauFragment extends Fragment {
    private LedManager ledManager ;

    private FragmentBerceauBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentBerceauBinding.inflate(inflater, container, false);
         ledManager = new LedManager();

        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0); // (fromXDelta, toXDelta, fromYDelta, toYDelta)
        animation.setDuration(1000); // Durée de l'animation en millisecondes
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.clm.startAnimation(animation);
        binding.lmp.startAnimation(animation);


        ledManager.getLedValue(new LedValueCallback() {
            @Override
            public void onValueReceived(Integer value) {
                if(value==1)
                    binding.lmpBtn.setText("Fermer");
                else
                    binding.lmpBtn.setText("Ouvrir");

            }

            @Override
            public void onFailure(Exception e) {
                Log.e("HomeActivity", "Erreur lors de la récupération de la valeur LED", e);
            }
        });

        binding.lmpBtn.setOnClickListener(e->{
            if(binding.lmpBtn.getText().toString().equals("Ouvrir"))
                ledManager.setLedValue(1, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        binding.lmpBtn.setText("Fermer");
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Log.e("HomeActivity", "Erreur lors de la mise à jour de la valeur LED", e);
                    }
                });
            else
                ledManager.setLedValue(0, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        binding.lmpBtn.setText("Ouvrir");
                    }

                    @Override
                    public void onFailure(Exception e) {
                        Log.e("HomeActivity", "Erreur lors de la mise à jour de la valeur LED", e);
                    }
                });
        });


    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}