package com.example.appmobile.view.accueil.notification;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.appmobile.databinding.FragmentNotificationBinding;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.NotificationManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class NotificationFragment extends Fragment implements NotificationAdapteur.OnManipule {


    private FragmentNotificationBinding binding;
    private NotificationAdapteur adapter;
    private List<Notification> notifications;
    private NotificationManager notificationManager;


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentNotificationBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        notifications = new ArrayList<>();
        FirebaseManager firebaseManager = new FirebaseManager();

        notificationManager=new NotificationManager(firebaseManager.getCurrentUser());
        adapter = new NotificationAdapteur(getActivity(), notifications,this);
        binding.recylerNotifications.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerNotifications.setAdapter(adapter);

        // Obtenir les clients depuis la base de données
        getNotification();

    }

    public void getNotification() {
        notificationManager.displayNotification(new NotificationManager.NotificationCallback() {
            @Override
            public void onSuccess(List<Notification> Notificationx) {
                notifications.clear();
                // Inverser directement la liste
                Collections.reverse(Notificationx);
                notifications.addAll(Notificationx);
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(getContext(), "Erreur : " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onClick(Notification notification, int pos) {
        // Faire quelque chose avec la notification cliquée (par exemple, détecter un clic sur une notification de renseignement)
        Toast.makeText(getContext(), notification.getType(), Toast.LENGTH_SHORT).show();
    }
}
