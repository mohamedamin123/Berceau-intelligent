package com.example.appmobile.view.accueil.notification;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

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

public class NotificationFragment extends Fragment  {

    private FragmentNotificationBinding binding;
    private NotificationController controller;
    private NotificationAdapteur adapter;
    private List<Notification> notifications;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentNotificationBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        notifications = new ArrayList<>();
        adapter = new NotificationAdapteur(getActivity(), notifications, (not,pos)->controller.onClick(not,pos));
        binding.recylerNotifications.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerNotifications.setAdapter(adapter);

        controller = new NotificationController(this, binding, adapter, notifications);
    }



    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
