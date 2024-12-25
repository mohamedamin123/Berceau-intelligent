package com.example.appmobile.view.accueil.notification;

import android.content.Intent;
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
import com.example.appmobile.databinding.FragmentNotificationBinding;
import com.example.appmobile.model.firebase.ClimatiseurManager;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.view.accueil.berceau.LumiereActivity;
import com.example.appmobile.view.accueil.berceau.MoteurActivity;
import com.google.firebase.auth.FirebaseUser;

public class NotificationFragment extends Fragment {

    private FragmentNotificationBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentNotificationBinding.inflate(inflater, container, false);
        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}