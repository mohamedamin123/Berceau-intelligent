package com.example.appmobile.alert;

import android.Manifest;
import android.bluetooth.BluetoothDevice;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.DialogFragment;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.example.appmobile.databinding.FragmentAjouterWifiBinding;
import com.example.appmobile.firebase.Reseau;
import com.example.appmobile.firebase.UpdateValueCallback;
import com.example.appmobile.reseau.BluetoothHelper;

public class AjouterWifiFragment extends DialogFragment {

    private static final String ARG_Wifi_ID = "Wifi_id";
    private FragmentAjouterWifiBinding binding;
    private String WifiId;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE = 3;
    private BluetoothDevice device;
    private BluetoothHelper bluetooth;

    public AjouterWifiFragment() {
        // Required empty public constructor
    }

    // Parameterized constructor
    public AjouterWifiFragment(String idWifi) {
        this.WifiId = idWifi != null ? idWifi : "";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            WifiId = getArguments().getString(ARG_Wifi_ID); // Default to 0 if not found
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
        binding.ssidEdt.setText(WifiId);

        String deviceName = "ESP32_Bluetooth"; // Replace with your device name
        bluetooth = new BluetoothHelper(getContext());

        device = bluetooth.getPairedDevice(deviceName);

        binding.btnAnnuler.setOnClickListener(e -> dismiss());

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
        Reseau reseau = new Reseau(getContext(), password); // Ensure constructor matches your use case

        checkBluetoothPermissions();

        if (!bluetooth.isBluetoothEnabled()) {
            bluetooth.enableBluetooth();
        } else {
            if (device != null) {
                bluetooth.connectToDevice(device);
                if (bluetooth.isConnected()) {
                    dismiss();
                    new Thread(() -> {
                        bluetooth.sendTwoMessagesAndRead(reseau.getSsid(), password);
                    }).start();
                } else {
                    Toast.makeText(getContext(), "Pas connecté à un appareil Bluetooth", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(getContext(), "Appareil non trouvé ou non couplé", Toast.LENGTH_SHORT).show();
            }
        }
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

    private void checkBluetoothPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Android 12 or later
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.BLUETOOTH_CONNECT)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.BLUETOOTH_CONNECT},
                        BLUETOOTH_PERMISSION_REQUEST_CODE);
            }
        }
    }
}
