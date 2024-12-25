package com.example.appmobile.view.accueil.berceau;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.TranslateAnimation;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.appmobile.R;
import com.example.appmobile.databinding.FragmentBerceauBinding;
import com.example.appmobile.model.entity.Bebe;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.model.firebase.ClimatiseurManager;
import com.example.appmobile.model.firebase.DHTManager;
import com.example.appmobile.model.firebase.FirebaseManager;
import com.example.appmobile.model.firebase.LedManager;
import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.example.appmobile.model.firebase.ServoMoteurManager;
import com.example.appmobile.model.firebase.interfaces.UpdateValueCallback;
import com.example.appmobile.view.accueil.notification.NotificationAdapteur;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class BerceauFragment extends Fragment implements BerceauAdapteur.OnManipule {

    private FragmentBerceauBinding binding;
    private BerceauAdapteur adapter;
    private List<Berceau> berceaus;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentBerceauBinding.inflate(inflater, container, false);

        return binding.getRoot();

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        berceaus = new ArrayList<>();
        adapter = new BerceauAdapteur(getActivity(), berceaus,this);
        binding.recylerBerceaux.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.recylerBerceaux.setAdapter(adapter);
        getBerceaux();
    }


    public void getBerceaux() {
        Berceau berceau1=new Berceau(1, "Berceau 1",true);
        Berceau berceau2=new Berceau(2, "Berceau 2",false);
        Berceau berceau3=new Berceau(3, "Berceau 3",true);
        //exemples des bebe
        Bebe bebe1=new Bebe(1, "Bebe 1",new Date(),10,10,10,10);
        Bebe bebe2=new Bebe(2, "Bebe 2",new Date(),10,10,10,10);
        Bebe bebe3=new Bebe(3, "Bebe 3",new Date(),10,10,10,10);

        //exemples des add des bebes
        berceau1.setBebe(bebe1);
        berceau2.setBebe(bebe2);
        berceau3.setBebe(bebe3);

        //exemple des add des berceaux
        berceaus.add(berceau1);
        berceaus.add(berceau2);
        berceaus.add(berceau3);




    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    @Override
    public void onClick(Berceau berceau) {
        //afficher toast
        Toast.makeText(getContext(), berceau.toString(), Toast.LENGTH_SHORT).show();

    }
}