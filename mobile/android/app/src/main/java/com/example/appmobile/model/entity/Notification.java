package com.example.appmobile.model.entity;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Notification {

    private Integer idNotification;
    private String message;
    private String type;
    private Date dateEnvoi; // Use Date type for proper formatting

    private int idBerceau;
    private int idParent;

    // Include hours and minutes in the date format
    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy HH:mm");

    public Notification() {

        this.dateEnvoi = new Date(); // Initialize to current date and time
    }

    // Constructors
    public Notification(String type, String message,int idBerceau) {
        this.type = type;
        this.message = message;
        this.dateEnvoi = new Date(); // Initialize to current date and time
        this.idBerceau=idBerceau;
    }

    public Notification(String type, String message,int idParent,int idBerceau) {
        this.type = type;
        this.message = message;
        this.dateEnvoi = new Date(); // Initialize to current date and time
        this.idParent = idParent;
        this.idBerceau = idBerceau;
    }

    // Getters and Setters
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

    public String getFormattedDateEnvoi() {
        return dateFormatter.format(dateEnvoi); // Format the date with hours and minutes
    }

    public Date getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(Date dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }


    public int getIdBerceau() {
        return idBerceau;
    }

    public void setIdBerceau(int idBerceau) {
        this.idBerceau = idBerceau;
    }

    public int getIdParent() {
        return idParent;
    }

    public void setIdParent(int idParent) {
        this.idParent = idParent;
    }

    // Method to send notification


    @Override
    public String toString() {
        return "Notification{" +
                "idNotification=" + idNotification +
                ", message='" + message + '\'' +
                ", type='" + type + '\'' +
                ", dateEnvoi=" + getFormattedDateEnvoi() +
                '}';
    }
}
