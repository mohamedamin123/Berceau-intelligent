package com.example.appmobile.ui.accueil.bebe;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
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
import java.util.concurrent.TimeUnit;

public class BebeFragment extends Fragment {

    private FragmentBebeBinding binding;
    private CountDownTimer laitTimer, dormirTimer, repasTimer, coucheTimer;
    private static final String PREFS_NAME = "BebePrefs";
    private static final String KEY_LAIT_START_TIME = "lait_start_time";
    private static final String KEY_DORMIR_START_TIME = "dormir_start_time";
    private static final String KEY_REPAS_START_TIME = "repas_start_time";
    private static final String KEY_COUCHE_START_TIME = "couche_start_time";

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentBebeBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TranslateAnimation animation = new TranslateAnimation(0, 0, 1000, 0); // (fromXDelta, toXDelta, fromYDelta, toYDelta)
        animation.setDuration(1000); // Durée de l'animation en millisecondes
        binding.laitLl.startAnimation(animation);
        binding.dormirLl.startAnimation(animation);
        binding.repasLl.startAnimation(animation);
        binding.coucheLl.startAnimation(animation);

        // Set onClickListeners for all buttons
        binding.laitLl.setOnClickListener(v -> showResetDialog(binding.laitEdt, KEY_LAIT_START_TIME, "'Lait'"));
        binding.dormirLl.setOnClickListener(v -> showResetDialog(binding.dormirEdt, KEY_DORMIR_START_TIME, "'Dormir'"));
        binding.repasLl.setOnClickListener(v -> showResetDialog(binding.repasEdt, KEY_REPAS_START_TIME, "'Repas'"));
        binding.coucheLl.setOnClickListener(v -> showResetDialog(binding.coucheEdt, KEY_COUCHE_START_TIME, "'Couche'"));

        // Resume each timer if a start time was saved
        resumeTimer(binding.laitEdt, KEY_LAIT_START_TIME);
        resumeTimer(binding.dormirEdt, KEY_DORMIR_START_TIME);
        resumeTimer(binding.repasEdt, KEY_REPAS_START_TIME);
        resumeTimer(binding.coucheEdt, KEY_COUCHE_START_TIME);
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

    private void startTimer(EditText editText, String key) {
        if (key.equals(KEY_LAIT_START_TIME)) {
            if (laitTimer != null) laitTimer.cancel();
            laitTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis();

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_DORMIR_START_TIME)) {
            if (dormirTimer != null) dormirTimer.cancel();
            dormirTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis();

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_REPAS_START_TIME)) {
            if (repasTimer != null) repasTimer.cancel();
            repasTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis();

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_COUCHE_START_TIME)) {
            if (coucheTimer != null) coucheTimer.cancel();
            coucheTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis();

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        }
    }

    private void resumeTimer(EditText editText, String key) {
        long savedStartTime = getSavedStartTime(key);
        if (savedStartTime > 0) {
            long elapsedMillis = System.currentTimeMillis() - savedStartTime;
            startTimerWithElapsed(editText, elapsedMillis, key);
        }
    }

    private void startTimerWithElapsed(EditText editText, long elapsedMillis, String key) {
        if (key.equals(KEY_LAIT_START_TIME)) {
            if (laitTimer != null) laitTimer.cancel();
            laitTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis() - elapsedMillis;

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_DORMIR_START_TIME)) {
            if (dormirTimer != null) dormirTimer.cancel();
            dormirTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis() - elapsedMillis;

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_REPAS_START_TIME)) {
            if (repasTimer != null) repasTimer.cancel();
            repasTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis() - elapsedMillis;

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        } else if (key.equals(KEY_COUCHE_START_TIME)) {
            if (coucheTimer != null) coucheTimer.cancel();
            coucheTimer = new CountDownTimer(Long.MAX_VALUE, 60000) {
                long startTime = System.currentTimeMillis() - elapsedMillis;

                @Override
                public void onTick(long millisUntilFinished) {
                    long elapsedMillis = System.currentTimeMillis() - startTime;
                    updateEditTextWithElapsedTime(editText, elapsedMillis);
                }

                @Override
                public void onFinish() {}
            }.start();
        }
    }

    private void updateEditTextWithElapsedTime(EditText editText, long elapsedMillis) {
        long minutes = TimeUnit.MILLISECONDS.toMinutes(elapsedMillis);
        long hours = TimeUnit.MILLISECONDS.toHours(elapsedMillis);

        String timeText;

        // If hours are greater than 0, show both hours and minutes, else just minutes.
        if (hours > 0) {
            // Format the hours and minutes correctly
            long remainingMinutes = minutes % 60; // Get the remaining minutes after full hours
            timeText = String.format("%dh %02d min", hours, remainingMinutes);
        } else {
            // Just display minutes if less than 1 hour
            timeText = String.format("%02d min", minutes);
        }

        editText.setText(timeText);
    }


    private void saveStartTime(String key, long startTime) {
        SharedPreferences prefs = requireContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putLong(key, startTime).apply();
    }

    private long getSavedStartTime(String key) {
        SharedPreferences prefs = requireContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getLong(key, 0);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (laitTimer != null) laitTimer.cancel();
        if (dormirTimer != null) dormirTimer.cancel();
        if (repasTimer != null) repasTimer.cancel();
        if (coucheTimer != null) coucheTimer.cancel();
    }
}
