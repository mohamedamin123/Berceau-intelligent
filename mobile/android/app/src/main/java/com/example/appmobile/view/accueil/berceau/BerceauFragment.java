package com.example.appmobile.view.accueil.berceau;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.appmobile.adapter.ListeBerceauAdapteur;
import com.example.appmobile.controller.berceau.BerceauController;
import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.utils.NotificationHelper;
import com.example.appmobile.service.NotificationService;
import com.google.firebase.auth.FirebaseUser;
import java.util.ArrayList;
import java.util.List;

public class BerceauFragment extends Fragment {

    private FragmentBerceauBinding binding;
    private ListeBerceauAdapteur adapter;
    private List<Berceau> berceaux;
    private BerceauManager berceauManager;
    private BerceauController controller;


    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentBerceauBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        FirebaseUser currentUser = new FirebaseManager().getCurrentUser();
        berceauManager = new BerceauManager(currentUser);

        berceaux = new ArrayList<>();
        adapter = new ListeBerceauAdapteur(getActivity(), berceaux, (berceau, pos) -> controller.onClick(berceau, pos));

        binding.recylerBerceaux.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerBerceaux.setAdapter(adapter);

        controller = new BerceauController(adapter, this, binding, berceauManager, berceaux);

        binding.btnAjouter.setOnClickListener(controller);

        Intent intent = new Intent(getActivity(), NotificationService.class);
        requireActivity().startService(intent);

        NotificationHelper.createNotificationChannel(getContext());

        controller.fetchBerceaux();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }


}
