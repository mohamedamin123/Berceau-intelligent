package com.example.appmobile.controller.berceau;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.widget.Toast;

import com.example.appmobile.databinding.ActivityAjouterBerceauBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.CapteurMVT;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.network.BluetoothHelper;
import com.example.appmobile.model.network.WifiHelper;
import com.example.appmobile.utils.CheckPermission;
import com.example.appmobile.view.accueil.berceau.AjouterBerceauActivity;
import com.google.firebase.auth.FirebaseUser;

import java.util.Calendar;

public class AjouterBerceauController {

    private final AjouterBerceauActivity context;
    private final ActivityAjouterBerceauBinding binding;
    private BerceauManager berceauManager;
    private BluetoothHelper bluetoothHelper;
    private FirebaseUser currentUser;
    private SharedPreferences sharedPreferences;
    private int size;
    private Berceau berceau;

    public AjouterBerceauController(AjouterBerceauActivity context, ActivityAjouterBerceauBinding binding) {
        this.context = context;
        this.binding = binding;
    }

    public void init() {
        FirebaseManager firebaseManager = new FirebaseManager();
        currentUser = firebaseManager.getCurrentUser();
        berceauManager = new BerceauManager(currentUser);
        bluetoothHelper = new BluetoothHelper(context, new Handler());
        sharedPreferences = context.getSharedPreferences("AppPreferences", Context.MODE_PRIVATE);

        initializeWifiSsid();
        size = ( context).getIntent().getIntExtra("size", -1) + 1;
        getAge();

        int modifier = ( context).getIntent().getIntExtra("modifier", -1);
        berceau = (modifier == -1) ? new Berceau() :
                (Berceau) (context).getIntent().getSerializableExtra("berceau");

        getBerceauExist();
    }

    public void setupListeners() {
        binding.btnAjouterBerceau.setOnClickListener(v -> ajouterBerceau());
    }

    private void getAge() {
        binding.etDateNaissance.setOnClickListener(v -> {
            final Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    context,
                    (view, selectedYear, selectedMonth, selectedDay) -> {
                        String date = selectedDay + "/" + (selectedMonth + 1) + "/" + selectedYear;
                        binding.etDateNaissance.setText(date);
                    },
                    year, month, day
            );

            datePickerDialog.show();
        });
    }

    private void ajouterBerceau() {
        String nomBerceau = binding.etNomBerceau.getText().toString();
        String nomBebe = binding.etNomBebe.getText().toString();
        String ageBebe = binding.etDateNaissance.getText().toString();
        String ssid = binding.ssid.getText().toString();
        String password = binding.motDePasse.getText().toString();

        if (nomBerceau.isEmpty() || nomBebe.isEmpty() || ageBebe.isEmpty() || ssid.isEmpty() || password.isEmpty()) {
            Toast.makeText(context, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            return;
        }

        connectToRaspberryPi();

        if (CheckPermission.ouvrirBluetooth(context, (AjouterBerceauActivity) context) ||
                CheckPermission.ouvrirLocation(context))
            return;

        new androidx.appcompat.app.AlertDialog.Builder(context)
                .setTitle("Confirmation")
                .setMessage("Voulez-vous vraiment ajouter ce berceau ?")
                .setPositiveButton("Oui", (dialog, which) -> {
                    envoyerMessageParBluetooth();
                    berceau.setNom(nomBerceau);
                    berceau.setBebe(new Bebe(nomBebe, ageBebe));

                    if (berceau.getId() == 0)
                        berceauManager.AjouterBerceau(berceau);
                    else {
                        berceau.ajouterDispositif(new CapteurMVT());
                        berceauManager.updateBerceauById(berceau);
                    }

                    ((AjouterBerceauActivity) context).finish();
                })
                .setNegativeButton("Non", (dialog, which) -> dialog.dismiss())
                .show();
    }

    private void connectToRaspberryPi() {
        bluetoothHelper.connectToRaspberryPi();
    }

    private void envoyerMessageParBluetooth() {
        String savedPassword = sharedPreferences.getString("userPassword", null);
        String message = binding.ssid.getText().toString() + " " + binding.motDePasse.getText().toString() + " " +
                currentUser.getEmail() + " " + savedPassword + " " + currentUser.getUid() + " berceau" + size;

        boolean isMessageSent = bluetoothHelper.sendMessage(message);

        Toast.makeText(context, isMessageSent ? "Données envoyées avec succès" : "Échec de l'envoi", Toast.LENGTH_SHORT).show();
    }

    private void initializeWifiSsid() {
        String ssid = WifiHelper.getCurrentSsid(context);
        binding.ssid.setText(ssid != null ? ssid : "Wi-Fi désactivé ou SSID introuvable");
    }

    private void getBerceauExist() {
        if (berceau.getId() != 0) {
            binding.etNomBerceau.setText(berceau.getNom());
            binding.etNomBebe.setText(berceau.getBebe().getPrenom());
            binding.etDateNaissance.setText(berceau.getBebe().getDateNaissance());
        }
    }
}
