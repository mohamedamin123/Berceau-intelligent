package com.example.appmobile.service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.os.SystemClock;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.example.appmobile.R;

public class TimerService extends Service {

    private static final String CHANNEL_ID = "TimerServiceChannel";
    private final IBinder binder = new LocalBinder();
    private long startTime = 0;
    private boolean isRunning = false;

    public class LocalBinder extends Binder {
        public TimerService getService() {
            return TimerService.this;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        startForeground(1, createNotification("Timer en cours..."));
        if (!isRunning) {
            startTime = SystemClock.elapsedRealtime();
            isRunning = true;
        }
    }

    private void createNotificationChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "Timer Service", NotificationManager.IMPORTANCE_LOW);
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification(String text) {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Timer en cours")
                .setContentText(text)
                .setSmallIcon(R.drawable.berceau) // Assurez-vous d'ajouter une icône
                .build();
    }

    public long getElapsedTime() {
        return SystemClock.elapsedRealtime() - startTime;
    }
}
