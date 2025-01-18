package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.example.appmobile.databinding.ActivityLumiereBinding;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.controller.berceau.LumiereController;

public class LumiereActivity extends AppCompatActivity {

    private ActivityLumiereBinding binding;
    private LumiereController controller;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLumiereBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }


    @Override
    protected void onStart() {
        super.onStart();
        controller = new LumiereController(this, binding);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding=null;
    }
}
