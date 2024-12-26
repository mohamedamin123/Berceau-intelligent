package com.example.appmobile.view.accueil.bebe;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.appmobile.databinding.FragmentDataBinding;

public class DataFragment extends Fragment {

    private static final String ARG_DATA = "arg_data";
    private FragmentDataBinding binding;

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

        // Récupérer les données depuis les arguments
        String data = getArguments() != null ? getArguments().getString(ARG_DATA) : "No Data";


    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null; // Libération de ViewBinding pour éviter les fuites de mémoire
    }
}
