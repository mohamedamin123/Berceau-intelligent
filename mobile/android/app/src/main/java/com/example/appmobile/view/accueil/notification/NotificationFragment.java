package com.example.appmobile.view.accueil.notification;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.appmobile.adapter.NotificationAdapteur;
import com.example.appmobile.controller.notification.NotificationController;
import com.example.appmobile.databinding.FragmentNotificationBinding;
import com.example.appmobile.model.entity.Notification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class NotificationFragment extends Fragment {

    private FragmentNotificationBinding binding;
    private NotificationController controller;
    private NotificationAdapteur adapter;
    private List<Notification> notifications;
    private List<Notification> allNotifications; // Liste complète des notifications pour filtrage

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentNotificationBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        notifications = new ArrayList<>();
        allNotifications = new ArrayList<>(); // Contient toutes les notifications non filtrées

        adapter = new NotificationAdapteur(getActivity(), notifications, (not, pos) -> controller.onClick(not, pos));
        binding.recylerNotifications.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerNotifications.setAdapter(adapter);

        controller = new NotificationController(this, binding, adapter, notifications);

        // 🔍 Ajouter un filtre de recherche sur les notifications
        binding.searchNotifications.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                controller.filterNotifications(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });


    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
