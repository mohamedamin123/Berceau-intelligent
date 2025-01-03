package com.example.appmobile.utils;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.view.accueil.berceau.AjouterBerceauActivity;
import com.example.appmobile.view.accueil.berceau.ConsulterBerceauActivity;

public class AlertCreation{

    public static void creeAlertBerceau(Berceau t, BerceauManager manager, Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Action pour " + t.getNom());
        builder.setMessage("Que voulez-vous faire avec cette berceau ?");

        // Ajouter image action
        builder.setPositiveButton("Consulter", (dialog, which) -> {
            Intent intent = new Intent(context, ConsulterBerceauActivity.class);
            intent.putExtra("berceau", t);
            intent.putExtra("id", "berceau"+(t.getId()));
            context.startActivity(intent);
            // Implement logic for adding an image
        });

        // Modifier action
        builder.setNeutralButton("Modifier", (dialog, which) -> {
            if (!CheckPermission.isBluetoothEnabled()) {
                Toast.makeText(context, "Veuillez activer le Bluetooth pour continuer", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!CheckPermission.isLocationEnabled(context)) {
                Toast.makeText(context, "Veuillez activer la localisation pour continuer", Toast.LENGTH_SHORT).show();
                return;
            }
            Intent intent = new Intent(context, AjouterBerceauActivity.class);
            intent.putExtra("berceau", t);
            intent.putExtra("id", "berceau"+(t.getId()));
            intent.putExtra("modifier",1);
            context.startActivity(intent);

        });

        // Supprimer action
        builder.setNegativeButton("Supprimer", (dialog, which) -> {
            // Confirmation dialog for deletion
            new AlertDialog.Builder(context)
                    .setTitle("Confirmer suppression")
                    .setMessage("Voulez-vous vraiment supprimer cette article ?")
                    .setPositiveButton("Oui", (confirmDialog, confirmWhich) -> {
                        // Logic to delete the item
                        try {
                            manager.supprimerBerceau(t.getId());
                        } catch (Exception e) {

                        }
                        // Implement logic for deletion
                    })
                    .setNegativeButton("Non", (confirmDialog, confirmWhich) -> {
                        // Logic for cancelling deletion
                        confirmDialog.dismiss();
                    })
                    .show();
        });

        // Show the dialog
        builder.create().show();
    }

}
