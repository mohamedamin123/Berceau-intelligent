package com.example.appmobile.view.accueil.home;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.example.appmobile.view.alert.AjouterWifiFragment;
import com.example.appmobile.databinding.FragmentHomeBinding;
import com.example.appmobile.model.firebase.Reseau;

public class HomeFragment extends Fragment {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE = 2;
    private static final int ENABLE_BT_REQUEST_CODE = 3; // Code pour demander à activer Bluetooth

    private FragmentHomeBinding binding;
    private BroadcastReceiver networkReceiver;


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        updateConnectionStatus();

        // Vérification des permissions de localisation (nécessaires pour les scans Bluetooth sur Android)
        setupNetworkReceiver();
        


        // Gestion du bouton de connexion Bluetooth
        binding.btnAJouter.setOnClickListener(e -> {
            if (!isWifiEnabled()) {
                Toast.makeText(requireContext(), "Veuillez activer le Wifi", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(android.provider.Settings.ACTION_WIFI_SETTINGS)); // Guide the user to Wi-Fi settings
            } else if (!isInternetConnected()) {
                Toast.makeText(requireContext(), "Veuillez vérifier la connexion Internet", Toast.LENGTH_SHORT).show();
            } else if (!isBluetoothEnabled()) {
                Toast.makeText(requireContext(), "Veuillez activer le Bluetooth", Toast.LENGTH_SHORT).show();
                startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), ENABLE_BT_REQUEST_CODE);
            } else if (!isLocationEnabled()) {
                Toast.makeText(requireContext(), "Veuillez activer la localisation", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS));
            } else {
                // Si tout est activé, procéder à l'action
                setupNetworkConnection();
            }
        });

    }

    private void setupNetworkReceiver() {
        networkReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                updateConnectionStatus();
            }
        };

        IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        requireContext().registerReceiver(networkReceiver, filter);
    }

    @Override
    public void onResume() {
        super.onResume();
        updateConnectionStatus();


    }

    private void updateConnectionStatus() {
        if (isInternetConnected()) {
            binding.connexion.setVisibility(View.GONE);
        } else {
            binding.connexion.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void setupNetworkConnection() {
        Reseau reseau = new Reseau(getContext());
        AjouterWifiFragment dialog = new AjouterWifiFragment(reseau.getSsid());
        dialog.setTargetFragment(this, 0); // Set target fragment to receive results
        dialog.show(getParentFragmentManager(), "AjouterWifiDialog");
    }

    /**
     * Vérifie si le Bluetooth est activé
     */
    private boolean isBluetoothEnabled() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    /**
     * Vérifie si la localisation est activée
     */
    private boolean isLocationEnabled() {
        LocationManager locationManager = (LocationManager) requireContext().getSystemService(Context.LOCATION_SERVICE);
        return locationManager != null && locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    private boolean isInternetConnected() {
        ConnectivityManager cm = (ConnectivityManager) requireContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        }
        return false;
    }

    private boolean isWifiEnabled() {
        ConnectivityManager cm = (ConnectivityManager) requireContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        return cm.getNetworkInfo(ConnectivityManager.TYPE_WIFI).isConnectedOrConnecting();
    }


    /**
     * Partie gestion des permissions
     * @param requestCode The request code passed in {@link #requestPermissions(String[], int)}.
     * @param permissions The requested permissions. Never null.
     * @param grantResults The grant results for the corresponding permissions
     * which is either {@link android.content.pm.PackageManager#PERMISSION_GRANTED}
     * or {@link android.content.pm.PackageManager#PERMISSION_DENIED}. Never null.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE || requestCode == BLUETOOTH_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(requireContext(), "Permission accordée", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(requireContext(), "Permission refusée", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void verifierPermission() {
        // Vérification des permissions Bluetooth et de localisation
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_REQUEST_CODE);
            }

            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.BLUETOOTH)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.BLUETOOTH},
                        BLUETOOTH_PERMISSION_REQUEST_CODE);
            }
        }
    }
}
