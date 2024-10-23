package com.example.appmobile.alert;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.DialogFragment;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.example.appmobile.databinding.FragmentAjouterWifiBinding;
import com.example.appmobile.firebase.Reseau;
import com.example.appmobile.firebase.UpdateValueCallback;

public class AjouterWifiFragment extends DialogFragment {

    private static final String ARG_Wifi_ID = "Wifi_id";
    private FragmentAjouterWifiBinding binding;
    private Integer WifiId;

    public AjouterWifiFragment() {
        // Required empty public constructor
    }

    // Parameterized constructor
    public AjouterWifiFragment(Integer idWifi) {
        this.WifiId = idWifi != null ? idWifi : 0;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            WifiId = getArguments().getInt(ARG_Wifi_ID, 0); // Default to 0 if not found
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentAjouterWifiBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.ssidEdt.setText(Reseau.ssid);

        binding.btnAnnuler.setOnClickListener(e->{
            dismiss();
        });

        // Configure button click listener
        binding.btnAjouter.setOnClickListener(v -> {
            String ssid = binding.ssidEdt.getText().toString().trim();
            String password = binding.passwordEdt.getText().toString().trim();

            if (!ssid.isEmpty() && !password.isEmpty()) {
                // Show confirmation alert
                new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                        .setTitle("Confirmation")
                        .setMessage("Êtes-vous sûr de vouloir ajouter ce Wi-Fi ?")
                        .setPositiveButton("Ajouter", (dialog, which) -> saveWifiToFirebase(ssid, password))
                        .setNegativeButton("Annuler", null)
                        .show();
            } else {
                Toast.makeText(requireContext(), "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void saveWifiToFirebase(String ssid, String password) {
        Reseau reseau = new Reseau(getContext(), password); // Assurez-vous que le constructeur correspond
        reseau.seConnecterReseau(new UpdateValueCallback() {
            @Override
            public void onSuccess() {
                Toast.makeText(requireContext(), "Wi-Fi ajouté avec succès", Toast.LENGTH_SHORT).show();
                dismiss(); // Ferme le dialog
            }

            @Override
            public void onFailure(Exception e) {
                Toast.makeText(requireContext(), "Échec de l'ajout du Wi-Fi", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        ViewGroup.LayoutParams params = getDialog().getWindow().getAttributes();
        params.width = ViewGroup.LayoutParams.MATCH_PARENT;
        params.height = ViewGroup.LayoutParams.WRAP_CONTENT;
        getDialog().getWindow().setAttributes((android.view.WindowManager.LayoutParams) params);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
