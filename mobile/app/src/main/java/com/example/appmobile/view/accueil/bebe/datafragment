package com.example.appmobile.view.accueil.bebe;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import android.os.CountDownTimer;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.EditText;
import android.widget.Toast;

import com.example.appmobile.databinding.FragmentDataBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.firebase.BebeManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;

import java.util.concurrent.TimeUnit;

public class DataFragment extends Fragment {

    private static final String ARG_DATA = "arg_data";
    private static final String TIMER_PREFS = "TimerPrefs"; // Préférences pour stocker l'état du timer

    private FragmentDataBinding binding;
    private BebeManager bebeManager;
    private Bebe bebe;
    private String chmp;
    private DatabaseReference databaseReference;
    private SharedPreferences sharedPreferences;

    private CountDownTimer laitTimer, dormirTimer, repasTimer, coucheTimer;

    private long startTime = 0; // Temps de départ
    private long elapsedTime = 0; // Temps écoulé

    public static DataFragment newInstance(String data) {
        DataFragment fragment = new DataFragment();
        Bundle args = new Bundle();
        args.putString(ARG_DATA, data);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Initialisation de ViewBinding
        binding = FragmentDataBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
        chmp = getArguments() != null ? getArguments().getString(ARG_DATA) : "No key";
        if (currentUser != null) {
            bebeManager = new BebeManager(currentUser);
            assert chmp != null;
            databaseReference = bebeManager.getDatabaseReference().child("users").child(currentUser.getUid())
                    .child("berceau")
                    .child(chmp)
                    .child("bebe");
        } else {
            Toast.makeText(getContext(), "Utilisateur non connecté", Toast.LENGTH_SHORT).show();
            return;
        }

        // Récupérer les données du bébé avec l'ID spécifique
        getBebe(chmp);

        // Initialiser SharedPreferences pour sauvegarder l'état du timer
        sharedPreferences = getContext().getSharedPreferences(TIMER_PREFS, Context.MODE_PRIVATE);

        // Restaurer les valeurs du timer spécifique à ce bébé
        startTime = sharedPreferences.getLong(getStartKey(chmp, "start_time"), 0);
        elapsedTime = sharedPreferences.getLong(getStartKey(chmp, "elapsed_time"), 0);

        // Si un temps écoulé existe, restaurer le timer
        if (startTime > 0) {
            restoreTimer(chmp, elapsedTime);
        }

        // Ajouter des animations pour chaque section
        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.laitLl.startAnimation(animation);
        binding.dormirLl.startAnimation(animation);
        binding.repasLl.startAnimation(animation);
        binding.coucheLl.startAnimation(animation);

        // Définir les onClickListeners pour chaque bouton (réinitialiser les timers)
        binding.laitLl.setOnClickListener(v -> showResetDialog(binding.laitEdt, "lait", "'Lait'"));
        binding.dormirLl.setOnClickListener(v -> showResetDialog(binding.dormirEdt, "dormir", "'Dormir'"));
        binding.repasLl.setOnClickListener(v -> showResetDialog(binding.repasEdt, "repas", "'Repas'"));
        binding.coucheLl.setOnClickListener(v -> showResetDialog(binding.coucheEdt, "couche", "'Couche'"));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null; // Libération de ViewBinding pour éviter les fuites de mémoire
    }

    private void getBebe(String key) {
        bebeManager.getBebe(key, new GetValueCallback() {
            @Override
            public void onValueReceived(Object o) {
                bebe = (Bebe) o;
            }

            @Override
            public void onFailure(Exception e) {
                // Gérer l'échec de récupération
            }
        });
    }

    private void showResetDialog(EditText editText, String key, String nom) {
        new AlertDialog.Builder(getContext())
                .setTitle("Confirmation")
                .setMessage("Voulez-vous réinitialiser le " + nom + " ?")
                .setPositiveButton("Oui", (dialog, which) -> {
                    resetBebeValue(key);
                    startTimer(editText, key);
                })
                .setNegativeButton("Non", null)
                .show();
    }

    private void startTimer(EditText editText, String key) {
        // Enregistrer l'heure de départ pour restaurer ultérieurement
        startTime = System.currentTimeMillis();

        CountDownTimer timer = new CountDownTimer(Long.MAX_VALUE, 60000) {
            long elapsedMillis = 0; // Temps écoulé initialement à 0

            @Override
            public void onTick(long millisUntilFinished) {
                // Calculez le temps écoulé en fonction du temps écoulé et du moment où le chronomètre a démarré
                elapsedMillis = System.currentTimeMillis() - startTime;
                updateEditTextWithElapsedTime(editText, elapsedMillis);
            }

            @Override
            public void onFinish() {
                // Optionnellement, vous pouvez gérer l'état de fin ici
            }
        }.start();

        assignTimer(timer, key);

        // Sauvegarder l'état du timer dans SharedPreferences
        sharedPreferences.edit().putLong(getStartKey(key, "start_time"), startTime).apply();
    }

    private void restoreTimer(String key, long elapsedMillis) {
        // Si un temps écoulé est fourni, ajuster l'heure de départ
        long restoredStartTime = System.currentTimeMillis() - elapsedMillis;

        CountDownTimer timer = new CountDownTimer(Long.MAX_VALUE, 60000) {
            long elapsedMillisLocal = 0; // Temps écoulé initialement à 0

            @Override
            public void onTick(long millisUntilFinished) {
                // Calculez le temps écoulé avec l'heure de départ ajustée
                elapsedMillisLocal = System.currentTimeMillis() - restoredStartTime;
                updateEditTextWithElapsedTime(binding.laitEdt, elapsedMillisLocal);  // Exemple avec le champ lait
            }

            @Override
            public void onFinish() {}
        }.start();

        assignTimer(timer, key);
    }

    private void assignTimer(CountDownTimer timer, String key) {
        switch (key) {
            case "lait":
                if (laitTimer != null) laitTimer.cancel();
                laitTimer = timer;
                break;
            case "dormir":
                if (dormirTimer != null) dormirTimer.cancel();
                dormirTimer = timer;
                break;
            case "repas":
                if (repasTimer != null) repasTimer.cancel();
                repasTimer = timer;
                break;
            case "couche":
                if (coucheTimer != null) coucheTimer.cancel();
                coucheTimer = timer;
                break;
        }
    }

    private void updateEditTextWithElapsedTime(EditText editText, long elapsedMillis) {
        long minutes = TimeUnit.MILLISECONDS.toMinutes(elapsedMillis);
        long hours = TimeUnit.MILLISECONDS.toHours(elapsedMillis);

        String timeText;
        if (hours > 0) {
            long remainingMinutes = minutes % 60;
            timeText = String.format("%dh %02d min", hours, remainingMinutes);
        } else {
            timeText = String.format("%02d min", minutes);

        }

        editText.setText(timeText);

        // Sauvegarder l'état du timer dans SharedPreferences pour ce bébé et ce paramètre
        sharedPreferences.edit().putLong(getStartKey(chmp, "elapsed_time"), elapsedMillis).apply();
    }

    private void resetBebeValue(String key) {
            bebeManager.initValue(chmp, key, new GetValueCallback() {
                @Override
                public void onValueReceived(Object o) {
                    switch (key) {
                        case "lait":
                            bebe.resetLait();
                            break;
                        case "dormir":
                            bebe.resetDormir();
                            break;
                        case "repas":
                            bebe.resetRepas();
                            break;
                        case "couche":
                            bebe.resetCouche();
                            break;
                    }
                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(getActivity(),"erreur",Toast.LENGTH_SHORT).show();

                }
            });

    }

    // Méthode pour générer la clé spécifique au bébé pour chaque paramètre
    private String getStartKey(String bebeId, String param) {
        return bebeId + "_" + param; // Exemple de clé : "bebe1_start_time", "bebe1_elapsed_time"
    }
}
