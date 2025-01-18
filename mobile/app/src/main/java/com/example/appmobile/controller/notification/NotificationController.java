package com.example.appmobile.controller.notification;

import android.widget.Toast;

import com.example.appmobile.adapter.NotificationAdapteur;
import com.example.appmobile.databinding.FragmentNotificationBinding;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.NotificationManager;
import com.example.appmobile.view.accueil.notification.NotificationFragment;

import java.util.Collections;
import java.util.List;

public class NotificationController implements NotificationAdapteur.OnManipule {

    private final NotificationFragment fragment;
    private final FragmentNotificationBinding binding;
    private final NotificationAdapteur adapter;
    private final List<Notification> notifications;
    private final NotificationManager notificationManager;

    public NotificationController(NotificationFragment fragment, FragmentNotificationBinding binding,
                                  NotificationAdapteur adapter,List<Notification> notifications) {
        this.fragment = fragment;
        this.binding = binding;
        this.adapter=adapter;
        this.notifications = notifications;

        FirebaseManager firebaseManager = new FirebaseManager();
        this.notificationManager = new NotificationManager(firebaseManager.getCurrentUser());

        getNotifications();
    }

    private void getNotifications() {
        notificationManager.displayNotification(new NotificationManager.NotificationCallback() {
            @Override
            public void onSuccess(List<Notification> notificationList) {
                notifications.clear();
                Collections.reverse(notificationList);
                notifications.addAll(notificationList);

                adapter.notifyDataSetChanged();
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(fragment.getContext(), "Erreur : " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }


    public void handleNotificationClick(Notification notification) {
        Toast.makeText(fragment.getContext(), notification.getType(), Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onClick(Notification notification, int pos) {
        handleNotificationClick(notification);
    }
}
