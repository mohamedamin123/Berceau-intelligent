package com.example.appmobile.controller.parent;

import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.Toast;


import com.example.appmobile.databinding.FragmentParentBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ParentManager;
import com.example.appmobile.model.firebase.interfaces.DataCallback;
import com.example.appmobile.model.entity.Parent;
import com.example.appmobile.utils.UperName;
import com.example.appmobile.view.accueil.parent.ParentFragment;
import com.example.appmobile.view.connexion.LoginActivity;
import com.google.firebase.auth.FirebaseUser;

public class ParentController {

    private final ParentFragment fragment;
    private final FragmentParentBinding binding;
    private final FirebaseManager firebaseManager;
    private final ParentManager parentManager;
    private Parent parent;

    public ParentController(ParentFragment fragment, FragmentParentBinding binding) {
        this.fragment = fragment;
        this.binding = binding;
        this.firebaseManager = new FirebaseManager(fragment.getContext());
        this.parentManager = new ParentManager(fragment.getContext());

        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        getData(currentUser);

        binding.btnMise.setOnClickListener(v -> mettreAjour(currentUser));
        binding.btnDeconnexion.setOnClickListener(v -> deconnexion());
    }

    private void getData(FirebaseUser currentUser) {
        if (currentUser != null) {
            String userId = currentUser.getUid();
            parentManager.getUser(userId, new DataCallback<Parent>() {
                @Override
                public void onSuccess(Parent parent) {
                    if (parent != null) {
                        binding.emailEdt.setText(parent.getEmail());
                        binding.nomEdt.setText(parent.getNom());
                        binding.prenomEdt.setText(parent.getPrenom());
                        binding.tvParent.setText(parent.getFullName());
                    }
                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(fragment.getContext(), "Erreur lors de la récupération des données.", Toast.LENGTH_SHORT).show();
                    Log.e("ParentController", "Erreur récupération utilisateur", e);
                }
            });
        } else {
            Toast.makeText(fragment.getContext(), "Utilisateur non connecté.", Toast.LENGTH_SHORT).show();
        }
    }

    private void mettreAjour(FirebaseUser currentUser) {
        if (currentUser != null) {
            String userId = currentUser.getUid();
            String newNom = UperName.capitalizeFirstLetter(binding.nomEdt.getText().toString());
            String newPrenom = UperName.capitalizeFirstLetter(binding.prenomEdt.getText().toString());

            Parent updatedParent = new Parent(newNom, newPrenom, currentUser.getEmail());
            parentManager.updateUser(userId, updatedParent);

            Toast.makeText(fragment.getContext(), "Mise à jour réussie.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(fragment.getContext(), "Utilisateur non connecté.", Toast.LENGTH_SHORT).show();
        }
    }

    private void deconnexion() {
        parent = new Parent(binding.nomEdt.getText().toString(), binding.prenomEdt.getText().toString());
        parent.seDeconnecter();
        parentManager.signOut();

        Intent intent = new Intent(fragment.getContext(), LoginActivity.class);
        fragment.startActivity(intent);
        fragment.getActivity().finish();
    }
}
