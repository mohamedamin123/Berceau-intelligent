package com.example.appmobile.view.accueil.bebe;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.appmobile.databinding.FragmentDataBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.firebase.BebeManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.viewmodel.TimerViewModel;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;

import java.util.concurrent.TimeUnit;

public class DataFragment extends Fragment {
    private static final String ARG_DATA = "arg_data"; // Clé pour les arguments

    private FragmentDataBinding binding;
    private BebeManager bebeManager;
    private Bebe bebe;
    private String chmp;
    private DatabaseReference databaseReference;
    private FirebaseUser currentUser;

    // ViewModel pour gérer les timers
    private TimerViewModel timerViewModel;

    // Méthode newInstance pour créer le fragment avec des arguments
    public static DataFragment newInstance(String data) {
        DataFragment fragment = new DataFragment();
        Bundle args = new Bundle();
        args.putString(ARG_DATA, data); // Ajouter les arguments au Bundle
        fragment.setArguments(args); // Définir les arguments pour le fragment
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentDataBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Récupérer les arguments passés au fragment
        Bundle args = getArguments();
        if (args != null) {
            chmp = args.getString(ARG_DATA); // Récupérer la valeur de ARG_DATA
        } else {
            chmp = "No key"; // Valeur par défaut si aucun argument n'est passé
        }

        // Initialiser le ViewModel avec le fragment comme scope
        timerViewModel = new ViewModelProvider(this).get(TimerViewModel.class);

        init();
        initfirebase();
        annimer();
        getBebe(chmp);
        setClick();
        restoreTimers(); // Restaurer les timers avec le temps écoulé précédent
    }
    private void init() {
        currentUser = FirebaseAuth.getInstance().getCurrentUser();
    }

    private void initfirebase() {
        if (currentUser != null) {
            bebeManager = new BebeManager(currentUser);
            databaseReference = bebeManager.getDatabaseReference().child("users").child(currentUser.getUid())
                    .child("berceau")
                    .child(chmp)
                    .child("bebe");
        } else {
            Toast.makeText(getContext(), "Utilisateur non connecté", Toast.LENGTH_SHORT).show();
            requireActivity().finish();
        }
    }

    private void annimer() {
        // Ajouter des animations pour chaque section
        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.laitLl.startAnimation(animation);
        binding.dormirLl.startAnimation(animation);
        binding.repasLl.startAnimation(animation);
        binding.coucheLl.startAnimation(animation);
    }

    private void setClick() {
        binding.laitLl.setOnClickListener(v -> showResetDialog(binding.laitEdt, "lait", "'Lait'"));
        binding.dormirLl.setOnClickListener(v -> showResetDialog(binding.dormirEdt, "dormir", "'Dormir'"));
        binding.repasLl.setOnClickListener(v -> showResetDialog(binding.repasEdt, "repas", "'Repas'"));
        binding.coucheLl.setOnClickListener(v -> showResetDialog(binding.coucheEdt, "couche", "'Couche'"));
    }

    private void showResetDialog(EditText editText, String key, String nom) {
        new AlertDialog.Builder(requireContext())
                .setTitle("Confirmation")
                .setMessage("Voulez-vous réinitialiser le " + nom + " ?")
                .setPositiveButton("Oui", (dialog, which) -> {
                    resetBebeValue(key);
                    startTimer(key, editText);
                })
                .setNegativeButton("Non", null)
                .show();
    }

    private void resetBebeValue(String key) {
        bebeManager.initValue(chmp, key, new GetValueCallback() {
            @Override
            public void onValueReceived(Object o) {
                switch (key) {
                    case "lait":
                        bebe.resetLait();
                        timerViewModel.setLaitElapsedTime(0); // Réinitialiser le temps écoulé pour le lait
                        break;
                    case "dormir":
                        bebe.resetDormir();
                        timerViewModel.setDormirElapsedTime(0); // Réinitialiser le temps écoulé pour dormir
                        break;
                    case "repas":
                        bebe.resetRepas();
                        timerViewModel.setRepasElapsedTime(0); // Réinitialiser le temps écoulé pour le repas
                        break;
                    case "couche":
                        bebe.resetCouche();
                        timerViewModel.setCoucheElapsedTime(0); // Réinitialiser le temps écoulé pour la couche
                        break;
                }
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(requireActivity(), "Erreur", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void restoreTimers() {
        // Redémarrer les timers avec le temps écoulé précédent
        if (timerViewModel.getLaitElapsedTime() > 0) {
            startTimer("lait", binding.laitEdt);
        }
        if (timerViewModel.getDormirElapsedTime() > 0) {
            startTimer("dormir", binding.dormirEdt);
        }
        if (timerViewModel.getRepasElapsedTime() > 0) {
            startTimer("repas", binding.repasEdt);
        }
        if (timerViewModel.getCoucheElapsedTime() > 0) {
            startTimer("couche", binding.coucheEdt);
        }
    }

    private void startTimer(String key, EditText editText) {
        CountDownTimer timer = createTimer(editText, key);
        switch (key) {
            case "lait":
                if (timerViewModel.getLaitTimer() != null) timerViewModel.getLaitTimer().cancel();
                timerViewModel.setLaitTimer(timer);
                timer.start();
                break;
            case "dormir":
                if (timerViewModel.getDormirTimer() != null) timerViewModel.getDormirTimer().cancel();
                timerViewModel.setDormirTimer(timer);
                timer.start();
                break;
            case "repas":
                if (timerViewModel.getRepasTimer() != null) timerViewModel.getRepasTimer().cancel();
                timerViewModel.setRepasTimer(timer);
                timer.start();
                break;
            case "couche":
                if (timerViewModel.getCoucheTimer() != null) timerViewModel.getCoucheTimer().cancel();
                timerViewModel.setCoucheTimer(timer);
                timer.start();
                break;
        }
    }

    private CountDownTimer createTimer(EditText editText, String key) {
        return new CountDownTimer(Long.MAX_VALUE, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                long elapsedTime = 0;
                switch (key) {
                    case "lait":
                        elapsedTime = timerViewModel.getLaitElapsedTime() + 1000;
                        timerViewModel.setLaitElapsedTime(elapsedTime);
                        break;
                    case "dormir":
                        elapsedTime = timerViewModel.getDormirElapsedTime() + 1000;
                        timerViewModel.setDormirElapsedTime(elapsedTime);
                        break;
                    case "repas":
                        elapsedTime = timerViewModel.getRepasElapsedTime() + 1000;
                        timerViewModel.setRepasElapsedTime(elapsedTime);
                        break;
                    case "couche":
                        elapsedTime = timerViewModel.getCoucheElapsedTime() + 1000;
                        timerViewModel.setCoucheElapsedTime(elapsedTime);
                        break;
                }
                updateEditText(editText, elapsedTime, key);
            }

            @Override
            public void onFinish() {
                // Ne rien faire ici, car le timer est infini
            }
        };
    }

    private void updateEditText(EditText editText, long elapsedTime, String key) {
        long seconds = TimeUnit.MILLISECONDS.toSeconds(elapsedTime) % 60;
        long minutes = TimeUnit.MILLISECONDS.toMinutes(elapsedTime) % 60;
        long hours = TimeUnit.MILLISECONDS.toHours(elapsedTime);

        String timeFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds);
        editText.setText(timeFormatted);
    }

    private void getBebe(String key) {
        bebeManager.getBebe(key, new GetValueCallback() {
            @Override
            public void onValueReceived(Object o) {
                bebe = (Bebe) o;
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(requireContext(), "Erreur de récupération des données", Toast.LENGTH_SHORT).show();
            }
        });
    }
}