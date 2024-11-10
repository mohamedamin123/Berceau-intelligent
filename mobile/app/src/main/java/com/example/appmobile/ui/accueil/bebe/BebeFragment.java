package com.example.appmobile.ui.accueil.bebe;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.EditText;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.appmobile.databinding.FragmentBebeBinding;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.concurrent.TimeUnit;

public class BebeFragment extends Fragment {

    private FragmentBebeBinding binding;
    private CountDownTimer laitTimer, dormirTimer, repasTimer, coucheTimer;

    private DatabaseReference databaseReference;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentBebeBinding.inflate(inflater, container, false);

        // Initialize Firebase Database reference to user's "bebe" path
        String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
        databaseReference = FirebaseDatabase.getInstance().getReference("users").child(userId).child("bebe");

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0);
        animation.setDuration(1000);
        binding.laitLl.startAnimation(animation);
        binding.dormirLl.startAnimation(animation);
        binding.repasLl.startAnimation(animation);
        binding.coucheLl.startAnimation(animation);

        // Set onClickListeners for all buttons
        binding.laitLl.setOnClickListener(v -> showResetDialog(binding.laitEdt, "lait_start_time", "'Lait'"));
        binding.dormirLl.setOnClickListener(v -> showResetDialog(binding.dormirEdt, "dormir_start_time", "'Dormir'"));
        binding.repasLl.setOnClickListener(v -> showResetDialog(binding.repasEdt, "repas_start_time", "'Repas'"));
        binding.coucheLl.setOnClickListener(v -> showResetDialog(binding.coucheEdt, "couche_start_time", "'Couche'"));

        // Resume each timer from Firebase
        resumeTimer(binding.laitEdt, "lait_start_time");
        resumeTimer(binding.dormirEdt, "dormir_start_time");
        resumeTimer(binding.repasEdt, "repas_start_time");
        resumeTimer(binding.coucheEdt, "couche_start_time");
    }

    private void showResetDialog(EditText editText, String key, String nom) {
        new AlertDialog.Builder(getContext())
                .setTitle("Confirmation")
                .setMessage("Voulez-vous réinitialiser le " + nom + " ?")
                .setPositiveButton("Oui", (dialog, which) -> {
                    saveStartTime(key, System.currentTimeMillis());
                    startTimer(editText, key);
                })
                .setNegativeButton("Non", null)
                .show();
    }

    private void saveStartTime(String key, long startTime) {
        databaseReference.child(key).setValue(startTime);
    }

    private void resumeTimer(EditText editText, String key) {
        databaseReference.child(key).get().addOnCompleteListener(task -> {
            if (task.isSuccessful() && task.getResult() != null) {
                Long savedStartTime = task.getResult().getValue(Long.class);
                if (savedStartTime != null) {
                    long elapsedMillis = System.currentTimeMillis() - savedStartTime;
                    startTimerWithElapsed(editText, elapsedMillis, key);
                }
            }
        });
    }

    private void startTimer(EditText editText, String key) {
        CountDownTimer timer = new CountDownTimer(Long.MAX_VALUE, 60000) {
            long startTime = System.currentTimeMillis();

            @Override
            public void onTick(long millisUntilFinished) {
                long elapsedMillis = System.currentTimeMillis() - startTime;
                updateEditTextWithElapsedTime(editText, elapsedMillis);
            }

            @Override
            public void onFinish() {}
        }.start();

        assignTimer(timer, key);
    }

    private void startTimerWithElapsed(EditText editText, long elapsedMillis, String key) {
        CountDownTimer timer = new CountDownTimer(Long.MAX_VALUE, 60000) {
            long startTime = System.currentTimeMillis() - elapsedMillis;

            @Override
            public void onTick(long millisUntilFinished) {
                long elapsedMillis = System.currentTimeMillis() - startTime;
                updateEditTextWithElapsedTime(editText, elapsedMillis);
            }

            @Override
            public void onFinish() {}
        }.start();

        assignTimer(timer, key);
    }

    private void assignTimer(CountDownTimer timer, String key) {
        switch (key) {
            case "lait_start_time":
                if (laitTimer != null) laitTimer.cancel();
                laitTimer = timer;
                break;
            case "dormir_start_time":
                if (dormirTimer != null) dormirTimer.cancel();
                dormirTimer = timer;
                break;
            case "repas_start_time":
                if (repasTimer != null) repasTimer.cancel();
                repasTimer = timer;
                break;
            case "couche_start_time":
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
    }
}
