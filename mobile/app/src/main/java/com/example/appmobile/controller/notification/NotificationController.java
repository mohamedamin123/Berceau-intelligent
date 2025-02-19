package com.example.appmobile.controller.notification;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.example.appmobile.adapter.NotificationAdapteur;
import com.example.appmobile.databinding.FragmentNotificationBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.NotificationManager;
import com.example.appmobile.view.accueil.notification.NotificationFragment;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class NotificationController implements NotificationAdapteur.OnManipule {

    private final NotificationFragment fragment;
    private final FragmentNotificationBinding binding;
    private final NotificationAdapteur adapter;
    private final List<Notification> notifications;
    private final NotificationManager notificationManager;
    private List<Notification> filtred;
    private BerceauManager berceauManager;

    public NotificationController(NotificationFragment fragment, FragmentNotificationBinding binding,
                                  NotificationAdapteur adapter,List<Notification> notifications) {
        this.fragment = fragment;
        this.binding = binding;
        this.adapter=adapter;
        this.notifications = notifications;

        FirebaseManager firebaseManager = new FirebaseManager();
        this.notificationManager = new NotificationManager(firebaseManager.getCurrentUser());

        getNotifications();
        filtred=new ArrayList<>();
        berceauManager=new BerceauManager(firebaseManager.getCurrentUser());
    }

    private void getNotifications() {
        notificationManager.displayNotification(new NotificationManager.NotificationCallback() {
            @Override
            public void onSuccess(List<Notification> notificationList) {
                // Ajouter uniquement les nouvelles notifications sans doublons
                for (Notification notif : notificationList) {
                    if (!notifications.contains(notif)) {
                        notifications.add(notif);
                    }
                }

                // Trier par dateEnvoi (du plus récent au plus ancien)
                notifications.sort((n1, n2) -> n2.getDateEnvoi().compareTo(n1.getDateEnvoi()));

                // Rafraîchir l'affichage
                adapter.notifyDataSetChanged();
                Log.d("notificationnn", "Total notifications: " + notifications.size());
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(fragment.getContext(), "Erreur : " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }



    /**
     * Filtre les notifications en fonction de la saisie utilisateur
     */
    public void filterNotifications(String query) {
        if (query.isEmpty()) {
            filtred.clear();
            filtred.addAll(notifications);
        } else {
            filtred = notifications.stream()
                    .filter(notification -> notification.getType().toLowerCase().contains(query.toLowerCase()) ||
                            notification.getDateEnvoi().toString().toLowerCase().contains(query.toLowerCase()))
                    .collect(Collectors.toList());
        }
        adapter.updateList(filtred);
    }


    /**
     * Méthode pour envoyer un message vocal au berceau
     */
    public void envoyerMessageVocal(Notification notification) {
        berceauManager.findByIdBerceau(notification.getIdBerceau(), new BerceauManager.BerceauCallback2() {
            @Override
            public void onSuccess(Berceau berceau) {
                new AlertDialog.Builder(fragment.getContext())
                        .setTitle("Envoi du message vocal")
                        .setMessage("Envoi du message vocal à " + berceau.getBebe().getPrenom() + " ...")
                        .setPositiveButton("OK", (dialog, which) -> envoyerMessage(berceau))
                        .setNegativeButton("Non", (dialog, which) -> dialog.dismiss())

                        .show();
            }

            @Override
            public void onError(Exception e) {
                new AlertDialog.Builder(fragment.getContext())
                        .setTitle("Erreur")
                        .setMessage("Il y a un problème : " + e.getMessage())
                        .setPositiveButton("OK", (dialog, which) -> dialog.dismiss())
                        .show();
                Log.d("id berceau", e.getMessage());
            }
        });
    }

    private void envoyerMessage(Berceau berceau) {
        // TODO : Envoyer le message vocal au Raspberry Pi
        Log.d("id berceau", "Envoi du message vocal à " + berceau.getBebe().getPrenom());
        Toast.makeText(fragment.getContext(), "Message vocal envoyé à " + berceau.getBebe().getPrenom(), Toast.LENGTH_SHORT).show();
    }


    @Override
    public void onClick(Notification notification, int pos) {
        envoyerMessageVocal(notification);
    }
}
