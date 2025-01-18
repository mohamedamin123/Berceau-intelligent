package com.example.appmobile.view.accueil.berceau;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.appmobile.databinding.ActivityAjouterBerceauBinding;
import com.example.appmobile.controller.berceau.AjouterBerceauController;

public class AjouterBerceauActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE = 3;
    private ActivityAjouterBerceauBinding binding;
    private AjouterBerceauController controller;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAjouterBerceauBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Initialiser le contrôleur et lui passer l'Activity et le binding
        controller = new AjouterBerceauController(this, binding);
        controller.init();
    }

    @Override
    protected void onStart() {
        super.onStart();
        requestPermissionsIfNeeded();
        controller.setupListeners();
    }

    private void requestPermissionsIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permissions de localisation accordées", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Permission de localisation refusée", Toast.LENGTH_SHORT).show();
            }
        }

        if (requestCode == BLUETOOTH_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permission Bluetooth accordée", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Permission Bluetooth refusée", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
