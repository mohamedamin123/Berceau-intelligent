package com.example.appmobile.view.accueil.berceau;

import android.os.Bundle;
import android.widget.SeekBar;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.appmobile.R;
import com.example.appmobile.databinding.ActivityConsulterBerceauBinding;
import com.example.appmobile.databinding.ActivityLumiereBinding;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.google.firebase.auth.FirebaseUser;

public class LumiereActivity extends AppCompatActivity {

    private ActivityLumiereBinding binding;
    private LedManager ledManager;
    String id;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLumiereBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        ledManager = new LedManager(currentUser);
        id=getIntent().getStringExtra("id");

        binding.btnOuvrir.setOnClickListener(e->{
            ledManager.ouvrirLed(id, new UpdateValueCallback() {
                @Override
                public void onSuccess() {
                    Toast.makeText(getApplicationContext(),"ouvrir la lumiere ",Toast.LENGTH_SHORT).show();
                    binding.seekBarIntensite.setProgress(1023);

                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(getApplicationContext(),"erreur dans ouvrir la lumiere ",Toast.LENGTH_SHORT).show();

                }
            });
        }
        );

        binding.btnFermer.setOnClickListener(e->{
                    ledManager.fermerLed(id, new UpdateValueCallback() {
                        @Override
                        public void onSuccess() {
                            Toast.makeText(getApplicationContext(),"fermer la lumiere ",Toast.LENGTH_SHORT).show();
                            binding.seekBarIntensite.setProgress(0);

                        }

                        @Override
                        public void onFailure(Exception e) {
                            Toast.makeText(getApplicationContext(),"erreur dans fermation la lumiere ",Toast.LENGTH_SHORT).show();

                        }
                    });
                }
        );
        binding.seekBarIntensite.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                ledManager.changeIntensite(id,progress, new UpdateValueCallback() {
                    @Override
                    public void onSuccess() {
                        Toast.makeText(getApplicationContext(),"fermer la lumiere ",Toast.LENGTH_SHORT).show();

                    }

                    @Override
                    public void onFailure(Exception e) {
                        Toast.makeText(getApplicationContext(),"erreur dans fermation la lumiere ",Toast.LENGTH_SHORT).show();

                    }
                });
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });


        binding.btnRetour.setOnClickListener(e->{
            finish();
        });


    }
}