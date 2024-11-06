package com.example.appmobile.ui.welcome.ui.welcome3;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.appmobile.databinding.FragmentWelcome3Binding;

public class Welcome3Fragment extends Fragment {

    private FragmentWelcome3Binding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWelcome3Binding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        binding.progressBar1.setProgress(100);
        binding.progressBar2.setProgress(200);
        binding.progressBar3.setProgress(200);
        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0); // (fromXDelta, toXDelta, fromYDelta, toYDelta)
        animation.setDuration(1000); // Durée de l'animation en millisecondes
        binding.imgWelcome.startAnimation(animation);
        binding.titre.startAnimation(animation);
        binding.paragraphe.startAnimation(animation);
        binding.bar.startAnimation(animation);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}