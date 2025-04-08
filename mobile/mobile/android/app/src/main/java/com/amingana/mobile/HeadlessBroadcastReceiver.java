package com.amingana.mobile;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.HeadlessJsTaskService;

public class HeadlessBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // Démarre le service pour exécuter la tâche headless
        Intent service = new Intent(context, HeadlessTaskService.class);
        context.startService(service);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
