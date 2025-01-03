package com.example.appmobile.view.accueil.berceau;

import static androidx.core.content.ContentProviderCompat.requireContext;

import android.Manifest;
import android.app.DatePickerDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityAjouterBerceauBinding;
import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.network.BluetoothHelper;
import com.example.appmobile.model.network.WifiHelper;
import com.google.firebase.auth.FirebaseUser;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Date;

public class AjouterBerceauActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE=3;
    private static final int ENABLE_BT_REQUEST_CODE = 3; // Code pour demander à activer Bluetooth

    private ActivityAjouterBerceauBinding binding;
    private BerceauManager berceauManager;
    private BluetoothHelper bluetoothHelper;
    private FirebaseUser currentUser;
    private SharedPreferences sharedPreferences;
    int size;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAjouterBerceauBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(this,
                                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                                        LOCATION_PERMISSION_REQUEST_CODE);
            }
        }
        verifierPermission();
        FirebaseManager firebaseManager = new FirebaseManager();
        currentUser = firebaseManager.getCurrentUser();
        berceauManager = new BerceauManager(currentUser);
        bluetoothHelper = new BluetoothHelper(this, new Handler());
        sharedPreferences = this.getSharedPreferences("AppPreferences", MODE_PRIVATE);
        initializeWifiSsid(); // Initialiser automatiquement le SSID
        size = getIntent().getIntExtra("size", -1) + 1;
        getAge();
        // Initialiser l'objet Berceau
        Berceau berceau = new Berceau();


        // Ajouter un listener sur le bouton
// Ajouter un listener sur le bouton
        binding.btnAjouterBerceau.setOnClickListener(v -> {
            String nomBerceau = binding.etNomBerceau.getText().toString();
            String nomBebe = binding.etNomBebe.getText().toString();
            String agebebe = binding.etDateNaissance.getText().toString();
            String ssid = binding.ssid.getText().toString();
            String password = binding.motDePasse.getText().toString();

            // Vérifier les champs
            if (nomBerceau.isEmpty() || nomBebe.isEmpty() || agebebe.isEmpty() || ssid.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
                return;
            }
            connectToRaspberryPi();



            if (!isBluetoothEnabled()) {
                        Toast.makeText(this, "Veuillez activer le Bluetooth", Toast.LENGTH_SHORT).show();
                        startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), ENABLE_BT_REQUEST_CODE); // Demande d'activation du Bluetooth
                        return;
            } else if (!isLocationEnabled()) {
                        Toast.makeText(this, "Veuillez activer la localisation", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS); // Ouvre les paramètres de localisation
                        startActivity(intent);
                        return;
            }
            // Afficher une boîte de dialogue pour confirmer l'ajout
            new androidx.appcompat.app.AlertDialog.Builder(this)
                    .setTitle("Confirmation")
                    .setMessage("Voulez-vous vraiment ajouter ce berceau ?")
                    .setPositiveButton("Oui", (dialog, which) -> {
                        // Action à réaliser si l'utilisateur confirme
                        connectToRaspberryPi();

                        // Créer un nouveau berceau avec les informations saisies
                        berceau.setNom(binding.etNomBerceau.getText().toString());
                        berceau.setBebe(new Bebe(nomBebe, agebebe));

                        berceauManager.AjouterBerceau(berceau);

                        // Retour à l'accueil
                        finish();
                    })
                    .setNegativeButton("Non", (dialog, which) -> {
                        // Action à réaliser si l'utilisateur annule (facultatif)
                        dialog.dismiss();
                    })
                    .show();
        });


    }

    private void verifierPermission() {
                // Vérification des permissions Bluetooth et de localisation
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(this,
                                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                                        LOCATION_PERMISSION_REQUEST_CODE);
            }

            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH)
                    != PackageManager.PERMISSION_GRANTED) {
                        ActivityCompat.requestPermissions(this,

                                        new String[]{Manifest.permission.BLUETOOTH},

                                        BLUETOOTH_PERMISSION_REQUEST_CODE);

            }

        }
    }

    private void getAge() {
        binding.etDateNaissance.setOnClickListener(v -> {
            // Obtenir la date actuelle
            final Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);

            // Afficher le DatePickerDialog
            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    AjouterBerceauActivity.this,
                    (view, selectedYear, selectedMonth, selectedDay) -> {
                        // Mettre à jour le champ EditText avec la date sélectionnée
                        String date = selectedDay + "/" + (selectedMonth + 1) + "/" + selectedYear;
                        binding.etDateNaissance.setText(date);
                    },
                    year, month, day
            );

            datePickerDialog.show();
        });
    }

    private void connectToRaspberryPi() {
        // Connexion à Raspberry Pi via Bluetooth
        bluetoothHelper.connectToRaspberryPi();
        String savedPassword = sharedPreferences.getString("userPassword", null);

        // Envoi du message au Raspberry Pi
        String message = binding.ssid.getText().toString() + " " + binding.motDePasse.getText().toString() + " " + currentUser.getEmail() + " " + savedPassword + " " + currentUser.getUid() + " " + "berceau" + size;

        bluetoothHelper.sendMessage(message);

    }

    private void initializeWifiSsid() {
        String ssid = WifiHelper.getCurrentSsid(this);
        if (ssid != null) {
            binding.ssid.setText(ssid); // Afficher le SSID dans le champ texte
        } else {
            Toast.makeText(this, "Wi-Fi désactivé ou SSID introuvable", Toast.LENGTH_SHORT).show();
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


    private boolean isBluetoothEnabled() {
                BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    private boolean isLocationEnabled() {
                LocationManager locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        return locationManager != null && locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }
}
