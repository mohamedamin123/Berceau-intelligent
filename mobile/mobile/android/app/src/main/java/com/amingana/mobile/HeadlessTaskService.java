package com.amingana.mobile; // Remplace par ton vrai nom de package si nécessaire

import android.content.Intent;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class HeadlessTaskService extends HeadlessJsTaskService {
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        return new HeadlessJsTaskConfig(
            "HeadlessCheckSon", // Nom de la tâche, doit correspondre à celui dans index.js
            null,
            5000, // Timeout de la tâche en millisecondes
            true // Lancer la tâche en arrière-plan même si l'app est en arrière-plan
        );
    }
}
