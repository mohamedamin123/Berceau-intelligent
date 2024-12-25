package com.example.appmobile.model.entity;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor // Génère un constructeur avec tous les champs
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Notification {

    private Integer idNotification;
    private String message;
    private String type;
    private Date dateEnvoi;

    private Berceau berceau;
    private Parent parent;

    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy HH:mm");


    public Notification(String type, String message) {
        this.type = type;
        this.message = message;
        this.dateEnvoi = new Date();  // Initialisation à la date et heure actuelles
    }

    public String getFormattedDateEnvoi() {
        return dateFormatter.format(dateEnvoi);
    }
    public Integer getIdNotification() {
        return idNotification;
    }

    public void setIdNotification(Integer idNotification) {
        this.idNotification = idNotification;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(Date dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Berceau getBerceau() {
        return berceau;
    }

    public void setBerceau(Berceau berceau) {
        this.berceau = berceau;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public void envoyerNotification() {
        // Code pour envoyer la notification (par exemple, par email ou autre)
        System.out.println("Notification envoyée au parent " + parent.getNom() + ": " + message);
    }


}
