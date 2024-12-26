package com.example.appmobile.view.accueil.bebe;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentPagerAdapter;

import com.example.appmobile.databinding.FragmentBebeBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.List;

public class BebeFragment extends Fragment {

    private FragmentBebeBinding binding;
    private List<Bebe> bebes;
    private BerceauManager berceauManager;
    String id;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentBebeBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Initialiser Firebase et BerceauManager
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
        if (currentUser != null) {
            berceauManager = new BerceauManager(currentUser);
        } else {
            Toast.makeText(getContext(), "Utilisateur non connecté", Toast.LENGTH_SHORT).show();
            return;
        }

        // Initialiser la liste des bébés
        bebes = new ArrayList<>();
        fetchDataFromFirebase();
    }

    private void fetchDataFromFirebase() {
        berceauManager.displayBerceau(new BerceauManager.BerceauCallback() {
            @Override
            public void onSuccess(List<Berceau> berceaus) {
                for (Berceau berceau : berceaus) {
                    if (berceau.getBebe() != null) {
                        bebes.add(berceau.getBebe());
                    }
                }
                setupViewPagerAndTabs();
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(getContext(), "Erreur lors de la récupération des données", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupViewPagerAndTabs() {
        // Vérifier que la liste des bébés n'est pas vide
        if (bebes.isEmpty()) {
            Toast.makeText(getContext(), "Aucun bébé disponible", Toast.LENGTH_SHORT).show();
            return;
        }

        // Initialiser l'adaptateur
        DynamicPagerAdapter adapter = new DynamicPagerAdapter(
                getChildFragmentManager(),
                FragmentPagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT
        );

        // Ajouter un fragment pour chaque bébé
        for (Bebe bebe : bebes) {
            String prenom = bebe.getPrenom() != null ? bebe.getPrenom() : "Inconnu";
            adapter.addFragment(DataFragment.newInstance("Données pour " + prenom), prenom);
        }

        // Configurer le ViewPager et le TabLayout
        binding.viewPager.setAdapter(adapter);
        binding.tabLayout.setupWithViewPager(binding.viewPager);
    }
}
