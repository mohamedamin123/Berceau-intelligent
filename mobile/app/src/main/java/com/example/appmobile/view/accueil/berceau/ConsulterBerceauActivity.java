package com.example.appmobile.view.accueil.berceau;

import android.content.Intent;
import android.os.Bundle;
import android.view.animation.TranslateAnimation;

import androidx.appcompat.app.AppCompatActivity;

import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.VentilateurManager;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class ConsulterBerceauActivity extends AppCompatActivity {
    private ActivityConsulterBerceauBinding binding;
    private DHTManager dhtManager;
    String id;
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
        Berceau berceau = (Berceau) getIntent().getSerializableExtra("berceau");
         id=getIntent().getStringExtra("id");

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.tmp.startAnimation(animation);
        binding.hmd.startAnimation(animation);
        binding.lmp.startAnimation(animation);
        binding.mvt.startAnimation(animation);
        binding.ventilateur.startAnimation(animation);
        binding.camera.startAnimation(animation);
        // Continuous update for LED button
           getTMP();
           getHMD();

        binding.mvtBtn.setOnClickListener(e -> {
            Intent intent = new Intent(this, MoteurActivity.class);
            intent.putExtra("id",id);
            startActivity(intent);
        });

        // Set button click listener to toggle LED value
        binding.lmpBtn.setOnClickListener(e -> {
            //changeLed();
            Intent intent = new Intent(this, LumiereActivity.class);
            intent.putExtra("id",id);
            startActivity(intent);
        });

        binding.ventilateurBtn.setOnClickListener(e -> {
            //changeLed();
            Intent intent = new Intent(this, ConsulterClimatiseurActivity.class);
            intent.putExtra("id",id);
            startActivity(intent);
        });

        binding.cameraBtn.setOnClickListener(e -> {
            //changeLed();
//            Intent intent = new Intent(this, LumiereActivity.class);
//            intent.putExtra("id",id);
//            startActivity(intent);
        });
    }





    private void getTMP() {
        dhtManager.listenToTmpValue(id,new GetValueCallback<Float>() {

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
        dhtManager.listenToHmdValue(id,new GetValueCallback<Float>() {


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
