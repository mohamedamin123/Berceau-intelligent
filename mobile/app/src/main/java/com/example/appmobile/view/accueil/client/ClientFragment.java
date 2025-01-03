package com.example.appmobile.view.accueil.client;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.appmobile.databinding.FragmentClientBinding;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.ParentManager;
import com.example.appmobile.model.firebase.interfaces.DataCallback;
import com.example.appmobile.model.entity.Parent;
import com.example.appmobile.utils.UperName;
import com.example.appmobile.view.connexion.LoginActivity;
import com.google.firebase.auth.FirebaseUser;

public class ClientFragment extends Fragment {

    private FragmentClientBinding binding;
    private FirebaseManager firebaseManager;
    private ParentManager parentManager;
    private Parent parent;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentClientBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        firebaseManager = new FirebaseManager(getContext());
        parentManager = new ParentManager(getContext());

        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        getData(currentUser);

        binding.btnMise.setOnClickListener(v -> mettreAjour(currentUser));
        binding.btnDeconnexion.setOnClickListener(v -> deconnexion());
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void getData(FirebaseUser currentUser) {
        if (currentUser != null) {
            String userId = currentUser.getUid();

            parentManager.getUser(userId, new DataCallback<Parent>() {
                @Override
                public void onSuccess(Parent parent) {
                    if (parent != null && binding != null) {
                        binding.emailEdt.setText(parent.getEmail());
                        binding.nomEdt.setText(parent.getNom());
                        binding.prenomEdt.setText(parent.getPrenom());
                        binding.tvParent.setText(parent.getFullName());
                    }
                }

                @Override
                public void onFailure(Exception e) {
                    // Handle error, show a Toast message
                    Toast.makeText(getContext(), "Failed to retrieve user data.", Toast.LENGTH_SHORT).show();
                    Log.e("ClientFragment", "Error fetching user data", e);
                }
            });
        } else {
            Toast.makeText(getContext(), "User is not signed in.", Toast.LENGTH_SHORT).show();
        }
    }

    private void mettreAjour(FirebaseUser currentUser) {
        if (currentUser != null) {
            String userId = currentUser.getUid();
            String newNom = UperName.capitalizeFirstLetter(binding.nomEdt.getText().toString());
            String newPrenom = UperName.capitalizeFirstLetter(binding.prenomEdt.getText().toString());

            Parent updatedParent = new Parent(newNom, newPrenom, currentUser.getEmail());

            parentManager.updateUser(userId, updatedParent);
            Toast.makeText(getContext(), "Données mises à jour avec succès.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(getContext(), "User is not signed in.", Toast.LENGTH_SHORT).show();
        }
    }

    private void deconnexion() {
        String nom = (binding.nomEdt.getText().toString());
        String prenom = (binding.prenomEdt.getText().toString());
        parent = new Parent(nom, prenom);
        parent.seDeconnecter();
        parentManager.signOut();
        Intent intent = new Intent(getContext(), LoginActivity.class);
        startActivity(intent);
        getActivity().finish(); // Close the current activity after logout
    }

}
