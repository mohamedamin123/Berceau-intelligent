package com.example.appmobile.utils;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.view.connexion.LoginActivity;
import com.google.firebase.auth.FirebaseUser;

public class NotificationHelper {
    private static final String CHANNEL_ID = "MVT_NOTIFICATION_CHANNEL";
    private static final int NOTIFICATION_ID = 1;



    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Mouvement Notifications";
            String description = "Notifications pour détecter des mouvements";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
    public static void showNotification(Context context, String title, String message, PendingIntent pendingIntent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                // Request the missing permission
                ActivityCompat.requestPermissions(
                        (Activity) context,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        101 // Request code
                );
                return; // Exit to prevent notification without permission
            }
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent) // Utiliser le PendingIntent pour ouvrir l'application
                .setAutoCancel(true); // Supprimer la notification après le clic
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        notificationManager.notify(NOTIFICATION_ID, builder.build());
    }

    public static void envoyerNotification(Context context, com.example.appmobile.model.firebase.NotificationManager notificationManager, String berceauKey,String type,String message) {

        int idBerceau = Convertit.convertirStringToInt(berceauKey);

        Notification notification = new Notification(type, message,idBerceau);
        notificationManager.AjouterNotification(berceauKey, notification);

        // Créer un Intent pour ouvrir l'application lorsqu'on clique sur la notification
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

        // PendingIntent qui ouvrira l'application
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // Affichage de la notification avec PendingIntent
        NotificationHelper.showNotification(
                context,
                type,
                message,
                pendingIntent
        );
    }


}
