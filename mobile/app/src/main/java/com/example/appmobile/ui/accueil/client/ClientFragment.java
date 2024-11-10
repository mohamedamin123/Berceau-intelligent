package com.example.appmobile.ui.accueil.client;

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
import com.example.appmobile.firebase.FirebaseManager;
import com.example.appmobile.model.User;
import com.example.appmobile.ui.connexion.LoginActivity;
import com.google.firebase.auth.FirebaseUser;

public class ClientFragment extends Fragment {

    private FragmentClientBinding binding;
    private FirebaseManager firebaseManager;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentClientBinding.inflate(inflater, container, false);
        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        firebaseManager = new FirebaseManager(getContext());
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

    private void getData( FirebaseUser currentUser) {
        if (currentUser != null) {
            String userId = currentUser.getUid();

            firebaseManager.getUserData(userId, new FirebaseManager.UserDataCallback() {
                @Override
                public void onUserDataReceived(User user) {

                    if(user!=null && binding!=null) {
                        binding.emailEdt.setText(user.getEmail());
                        binding.nomEdt.setText(user.getNom());
                        binding.prenomEdt.setText(user.getPrenom());
                    }
                }

                @Override
                public void onFailure(Exception e) {
                    // Handle error, e.g., show a Toast message
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
            String newNom = binding.nomEdt.getText().toString();
            String newPrenom = binding.prenomEdt.getText().toString();

            firebaseManager.updateUserData(userId, newNom, newPrenom, new FirebaseManager.UserDataUpdateCallback() {
                @Override
                public void onSuccess() {
                    Toast.makeText(getContext(), "Données mises à jour avec succès.", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(Exception e) {
                    Toast.makeText(getContext(), "Échec de la mise à jour des données.", Toast.LENGTH_SHORT).show();
                    Log.e("ClientFragment", "Error updating user data", e);
                }
            });
        } else {
            Toast.makeText(getContext(), "User is not signed in.", Toast.LENGTH_SHORT).show();
        }
    }

    private void deconnexion() {
        firebaseManager.signOut();
        Intent intent=new Intent(getContext(), LoginActivity.class);
        startActivity(intent);
    }
}