package com.example.appmobile.controller.berceau;

import android.content.Intent;
import android.view.View;
import android.widget.Toast;

import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.utils.AlertCreation;
import com.example.appmobile.view.accueil.berceau.AjouterBerceauActivity;
import com.example.appmobile.adapter.ListeBerceauAdapteur;
import com.example.appmobile.view.accueil.berceau.BerceauFragment;
import java.util.List;

public class BerceauController implements ListeBerceauAdapteur.OnManipule, View.OnClickListener {

    private ListeBerceauAdapteur adapter;
    private BerceauFragment fragment;
    private FragmentBerceauBinding binding;
    private BerceauManager berceauManager;
    private List<Berceau> berceaux;
    private int sizeBerceau;

    public BerceauController(ListeBerceauAdapteur adapter, BerceauFragment fragment, FragmentBerceauBinding binding, BerceauManager berceauManager, List<Berceau> berceaux) {
        this.adapter = adapter;
        this.fragment = fragment;
        this.binding = binding;
        this.berceauManager = berceauManager;
        this.berceaux = berceaux;
    }

    public void fetchBerceaux() {
        berceauManager.displayBerceauRealtime(new BerceauManager.BerceauCallback() {
            @Override
            public void onSuccess(List<Berceau> b) {
                berceaux.clear();
                berceaux.addAll(b);
                sizeBerceau = b.size();
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onError(Exception e) {
                showToast("Erreur dans l'affichage des berceaux");
            }
        });
    }

    private void showAlert(Berceau berceau) {
        AlertCreation.creeAlertBerceau(berceau, berceauManager, fragment.getContext());
    }

    private void showToast(String message) {
        Toast.makeText(fragment.getContext(), message, Toast.LENGTH_SHORT).show();
    }

    private void navigateToAjouterBerceau(int size) {
        if(AlertCreation.checkBluetoothAndLocalisation(fragment.getContext())) {
            Intent intent = new Intent(fragment.getContext(), AjouterBerceauActivity.class);
            intent.putExtra("size", size);
            fragment.startActivity(intent);
        }
    }
    @Override
    public void onClick(Berceau berceau, int pos) {
        showAlert(berceau);
        berceauManager.miseAJour("berceau" + (pos + 1));
    }

    @Override
    public void onClick(View v) {
        if (v == binding.btnAjouter) {
            navigateToAjouterBerceau(sizeBerceau);
        }
    }
}
