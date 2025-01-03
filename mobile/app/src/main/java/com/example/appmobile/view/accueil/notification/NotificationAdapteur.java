package com.example.appmobile.view.accueil.notification;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.appmobile.R;
import com.example.appmobile.databinding.CustomItemNotificationBinding;
import com.example.appmobile.model.entity.Berceau;
import com.example.appmobile.model.entity.Notification;

import java.util.List;

public class NotificationAdapteur extends RecyclerView.Adapter<NotificationAdapteur.MyViewHolder>{

    private Context context;
    private List<Notification> notifications;
    private OnManipule listener;

    public NotificationAdapteur(Context context, List<Notification> notifications) {
        this.context = context;
        this.notifications = notifications;
    }

    public NotificationAdapteur(Context context, List<Notification> notifications,OnManipule listener) {
        this.context = context;
        this.notifications = notifications;
        this.listener=listener;
    }

    @NonNull
    @Override
    public NotificationAdapteur.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View v = inflater.inflate(R.layout.custom_item_notification, parent, false);

        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull NotificationAdapteur.MyViewHolder holder, int position) {
        Notification notification = notifications.get(position);

        holder.binding.typeNotification.setText(notification.getType());
        holder.binding.dateEnvoi.setText(String.valueOf(notification.getFormattedDateEnvoi()));
        holder.binding.textNotification.setText(notification.getMessage());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onClick(notification,position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return notifications.size();
    }


    public class MyViewHolder extends RecyclerView.ViewHolder {
        CustomItemNotificationBinding binding;

        public MyViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = CustomItemNotificationBinding.bind(itemView);
        }
    }

    public interface OnManipule {
        void onClick(Notification notification, int pos);
    }
}
