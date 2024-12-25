package com.example.appmobile.view.alert;

import static android.content.Context.MODE_PRIVATE;

import android.Manifest;
import android.bluetooth.BluetoothDevice;
import android.content.SharedPreferences;
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
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.Reseau;
import com.example.appmobile.model.network.BluetoothHelper;
import com.google.firebase.auth.FirebaseUser;

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

        String deviceName = "ESP32_Bluetoot"; // Replace with your device name
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
        Reseau reseau = new Reseau(getContext(), password);

        // Check Bluetooth permissions
        checkBluetoothPermissions();

        if (!bluetooth.isBluetoothEnabled()) {
            bluetooth.enableBluetooth();
        } else {
            if (device != null) {
                bluetooth.connectToDevice(device);
                if (bluetooth.isConnected()) {
                    dismiss();
                    new Thread(() -> {
                        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences("AppPreferences", MODE_PRIVATE);
                        String savedEmail = sharedPreferences.getString("userEmail", null);
                        String savedPassword = sharedPreferences.getString("userPassword", null);

                        FirebaseManager firebaseManager = new FirebaseManager(getContext());
                        FirebaseUser currentUser = firebaseManager.getCurrentUser();
                        bluetooth.sendTwoMessagesAndRead(reseau.getSsid(), password, currentUser.getEmail(), savedPassword, currentUser.getUid());
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
            // Android 12 or higher
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                // Request Bluetooth permissions
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_SCAN},
                        BLUETOOTH_PERMISSION_REQUEST_CODE);
            }
        } else {
            // For devices below Android 12, just check if ACCESS_FINE_LOCATION permission is granted
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                        BLUETOOTH_PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == BLUETOOTH_PERMISSION_REQUEST_CODE) {
            boolean allPermissionsGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allPermissionsGranted = false;
                    break;
                }
            }

            if (allPermissionsGranted) {
                // Bluetooth permissions granted
                Toast.makeText(getContext(), "Permissions Bluetooth accordées", Toast.LENGTH_SHORT).show();
            } else {
                // Handle the case where permissions are denied
                Toast.makeText(getContext(), "Permissions Bluetooth refusées. Impossible de se connecter au Bluetooth.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
