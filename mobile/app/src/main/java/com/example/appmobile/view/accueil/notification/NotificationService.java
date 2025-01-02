package com.example.appmobile.view.accueil.notification;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.MVTManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class NotificationService extends Service {

    private MVTManager mvt;


    @Override
    public void onCreate() {
        super.onCreate();
        listenToFirebase();
    }

    private void listenToFirebase() {
        FirebaseManager firebaseManager = new FirebaseManager(); // Adapter selon votre code
        mvt = new MVTManager(firebaseManager.getCurrentUser(),getApplicationContext()); // Adapter selon votre code
       mvt.lireTousLesMVT();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY; // Pour redémarrer le service si le système l'arrête
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
