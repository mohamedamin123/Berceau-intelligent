package com.example.appmobile.ui.home;


import android.Manifest;
import android.bluetooth.BluetoothDevice;
import android.content.pm.PackageManager;
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

import com.example.appmobile.alert.AjouterWifiFragment;
import com.example.appmobile.databinding.FragmentHomeBinding;
import com.example.appmobile.firebase.Reseau;
import com.example.appmobile.reseau.BluetoothHelper;

public class HomeFragment extends Fragment {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private static final int BLUETOOTH_PERMISSION_REQUEST_CODE=3;

    private FragmentHomeBinding binding;
    private BluetoothHelper bluetoothHelper;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        bluetoothHelper = new BluetoothHelper(getContext()); // Initialisation de la classe BluetoothHelper
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Vérification des permissions de localisation (nécessaires pour les scans Bluetooth sur Android)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(),
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_REQUEST_CODE);
            }
        }

        // Gestion du bouton de connexion Bluetooth
        binding.button.setOnClickListener(e -> {
            // Vérifier les permissions Bluetooth avant de continuer

            setupNetworkConnection();

        });

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(requireContext(), "Permissions de localisation accordées", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(requireContext(), "Permission de localisation refusée", Toast.LENGTH_SHORT).show();
            }
        }
        if (requestCode == BLUETOOTH_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(requireContext(), "Permission Bluetooth accordée", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(requireContext(), "Permission Bluetooth refusée", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void setupNetworkConnection() {
        Reseau reseau=new Reseau(getContext());
        AjouterWifiFragment dialog = new AjouterWifiFragment(reseau.getSsid());
        dialog.setTargetFragment(this, 0); // Set target fragment to receive results
        dialog.show(getParentFragmentManager(), "AjouterWifiDialog");
    }



    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
