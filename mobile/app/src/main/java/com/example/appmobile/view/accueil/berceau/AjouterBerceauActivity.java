package com.example.appmobile.view.accueil.berceau;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
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
import com.google.firebase.auth.FirebaseUser;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Date;

public class AjouterBerceauActivity extends AppCompatActivity {

    private ActivityAjouterBerceauBinding binding;
    private BerceauManager berceauManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAjouterBerceauBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        berceauManager=new BerceauManager(currentUser);

        getAge();
        // Initialiser l'objet Berceau
        Berceau berceau = new Berceau();

        // Ajouter un listener sur le bouton
            binding.btnAjouter.setOnClickListener(v -> {

                String nomBerceau=binding.etNomBerceau.getText().toString();
                String nomBebe=binding.etNomBebe.getText().toString();
                String agebebe=binding.etDateNaissance.getText().toString();

                // Vérifier les champs
                if (nomBerceau.isEmpty() || nomBebe.isEmpty() || agebebe.isEmpty()) {
                    Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
                    return;
                }

                // Créer un nouveau berceau avec les informations saisies
                berceau.setNom(binding.etNomBerceau.getText().toString());
                berceau.setBebe(new Bebe(nomBebe,agebebe));

                berceauManager.AjouterBerceau(berceau);

                // Retour à l'accueil
                finish();

            });

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
}