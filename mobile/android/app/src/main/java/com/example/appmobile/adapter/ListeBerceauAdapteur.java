package com.example.appmobile.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.appmobile.R;
import com.example.appmobile.databinding.CustomItemBerceauBinding;
import com.example.appmobile.model.entity.Berceau;

import java.util.List;

public class ListeBerceauAdapteur extends RecyclerView.Adapter<ListeBerceauAdapteur.MyViewHolder> {

    private Context context;
    private List<Berceau> berceaus;
    private OnManipule listener;

    public ListeBerceauAdapteur(Context context, List<Berceau> berceaus) {
        this.context = context;
        this.berceaus = berceaus;
    }
    public ListeBerceauAdapteur(Context context, List<Berceau> berceaus, OnManipule listener) {
        this.context = context;
        this.berceaus = berceaus;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ListeBerceauAdapteur.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.custom_item_berceau, parent, false);

        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ListeBerceauAdapteur.MyViewHolder holder, int position) {
        Berceau berceau = berceaus.get(position);
        if(berceau!=null) {
            holder.binding.nomBerceau.setText(berceau.getNom());
            holder.binding.nomBebe.setText(berceau.getBebe().getPrenom());

            holder.itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onClick(berceau,position);
                }
            });
        }

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
