package com.example.appmobile.view.accueil.berceau;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.firebase.BerceauManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.view.accueil.notification.NotificationHelper;
import com.example.appmobile.view.accueil.notification.NotificationService;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class BerceauFragment extends Fragment implements BerceauAdapteur.OnManipule {

    private FragmentBerceauBinding binding;
    private BerceauAdapteur adapter;
    private List<Berceau> berceaus;
    private BerceauManager berceauManager;
    private int sizeBerceau;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentBerceauBinding.inflate(inflater, container, false);

        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        NotificationHelper.createNotificationChannel(getContext()); // Initialize the channel
        FirebaseManager firebaseManager = new FirebaseManager();
        FirebaseUser currentUser = firebaseManager.getCurrentUser();
        berceauManager=new BerceauManager(currentUser);

        berceaus = new ArrayList<>();
        adapter = new BerceauAdapteur(getActivity(), berceaus,this);
        binding.recylerBerceaux.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerBerceaux.setAdapter(adapter);

        Intent intent = new Intent(getActivity(), NotificationService.class);
        requireActivity().startService(intent);



        binding.btnAjouter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), AjouterBerceauActivity.class);
                intent.putExtra("size",sizeBerceau);
                startActivity(intent);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        getBerceaux();

    }

    @Override
    public void onStart() {
        super.onStart();
        berceauManager.setAllEtatToFalse();

    }

    public void getBerceaux() {

        berceauManager.displayBerceau(new BerceauManager.BerceauCallback() {
            @Override
            public void onSuccess(List<Berceau> b) {
                berceaus.clear();
                //ajouer berceau
                berceaus.addAll(b);
                sizeBerceau=b.size();
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onError(Exception e) {
                Toast.makeText(getContext(),"erreur dans affichage des berceau",Toast.LENGTH_SHORT).show();
            }
        });


    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onClick(Berceau berceau,int pos) {
        //afficher toast
        Intent intent = new Intent(getContext(),ConsulterBerceauActivity.class);
        intent.putExtra("berceau", berceau);
        intent.putExtra("id", "berceau"+(pos+1));
        berceauManager.miseAJour("berceau"+(pos+1));
        startActivity(intent);

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 101) { // Match the request code used earlier
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted, you can now show notifications
                Toast.makeText(getContext(), "Notification permission granted.", Toast.LENGTH_SHORT).show();
            } else {
                // Permission denied
                Toast.makeText(getContext(), "Notification permission denied.", Toast.LENGTH_SHORT).show();
            }
        }
    }

}