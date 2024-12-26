package com.example.appmobile.view.accueil.berceau;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.appmobile.R;
import com.example.appmobile.databinding.CustomItemBerceauBinding;
import com.example.appmobile.databinding.CustomItemNotificationBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.Notification;
import com.example.appmobile.view.accueil.notification.NotificationAdapteur;

import java.util.List;

public class BerceauAdapteur extends RecyclerView.Adapter<BerceauAdapteur.MyViewHolder> {

    private Context context;
    private List<Berceau> berceaus;
    private OnManipule listener;


    public BerceauAdapteur(Context context, List<Berceau> berceaus,OnManipule listener) {
        this.context = context;
        this.berceaus = berceaus;
        this.listener = listener;
    }

    @NonNull
    @Override
    public BerceauAdapteur.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.custom_item_berceau, parent, false);

        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull BerceauAdapteur.MyViewHolder holder, int position) {
        Berceau berceau = berceaus.get(position);

        holder.binding.nomBerceau.setText(berceau.getNom());
        holder.binding.nomBebe.setText(berceau.getBebe().getPrenom());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onClick(berceau,position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return berceaus.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        CustomItemBerceauBinding binding;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = CustomItemBerceauBinding.bind(itemView);
        }
    }

    public interface OnManipule {
        void onClick(Berceau berceau,int pos);
    }
}
