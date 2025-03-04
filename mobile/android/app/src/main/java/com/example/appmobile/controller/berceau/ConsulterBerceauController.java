package com.example.appmobile.controller.berceau;

import android.content.Intent;
import android.view.View;

import androidx.annotation.NonNull;

import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.view.accueil.berceau.CameraActivity;
import com.example.appmobile.view.accueil.berceau.ConsulterBerceauActivity;
import com.example.appmobile.view.accueil.berceau.ConsulterVentilateurActivity;
import com.example.appmobile.view.accueil.berceau.LumiereActivity;
import com.example.appmobile.view.accueil.berceau.MoteurActivity;
import com.google.firebase.auth.FirebaseUser;

public final class ConsulterBerceauController implements View.OnClickListener {

    private final ActivityConsulterBerceauBinding binding;
    private final ConsulterBerceauActivity activity;
    private final String id;
    private final DHTManager dhtManager;

    public ConsulterBerceauController(@NonNull ActivityConsulterBerceauBinding binding, @NonNull ConsulterBerceauActivity activity, @NonNull String id) {
        this.binding = binding;
        this.activity = activity;
        this.id = id;
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        this.dhtManager = new DHTManager(currentUser);
        setListeners();
        getTMP();
        getHMD();
    }

    private void setListeners() {
        binding.cameraBtn.setOnClickListener(this);
        binding.ventilateurBtn.setOnClickListener(this);
        binding.lmpBtn.setOnClickListener(this);
        binding.mvtBtn.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v == binding.cameraBtn) {
            lancerCamera();
        } else if (v == binding.ventilateurBtn) {
            lancerVentilateur();
        } else if (v == binding.lmpBtn) {
            lancerLumiere();
        } else if (v == binding.mvtBtn) {
            lancerMoteur();
        }
    }

    private void lancerCamera() {
        activity.startActivity(new Intent(activity, CameraActivity.class));
    }

    private void lancerVentilateur() {
        Intent intent = new Intent(activity, ConsulterVentilateurActivity.class);
        intent.putExtra("id", id);
        activity.startActivity(intent);
    }

    private void lancerLumiere() {
        Intent intent = new Intent(activity, LumiereActivity.class);
        intent.putExtra("id", id);
        activity.startActivity(intent);
    }

    private void lancerMoteur() {
        Intent intent = new Intent(activity, MoteurActivity.class);
        intent.putExtra("id", id);
        activity.startActivity(intent);
    }

    private void getTMP() {
        dhtManager.listenToTmpValue(id, new GetValueCallback<Float>() {
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
        dhtManager.listenToHmdValue(id, new GetValueCallback<Float>() {
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
}
