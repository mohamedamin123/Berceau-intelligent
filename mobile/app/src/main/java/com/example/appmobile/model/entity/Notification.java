package com.example.appmobile.model.entity;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Notification {

    private Integer idNotification;
    private String message;
    private String type;
    private Date dateEnvoi; // Use Date type for proper formatting

    private Berceau berceau;
    private Parent parent;

    // Include hours and minutes in the date format
    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy HH:mm");

    public Notification() {

        this.dateEnvoi = new Date(); // Initialize to current date and time
    }

    // Constructors
    public Notification(String type, String message) {
        this.type = type;
        this.message = message;
        this.dateEnvoi = new Date(); // Initialize to current date and time
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

    // Method to send notification
    public void envoyerNotification() {
        // Code for sending notification (e.g., email or other methods)
        System.out.println("Notification envoyée au parent " + parent.getNom() + ": " + message);
    }

    @Override
    public String toString() {
        return "Notification{" +
                "idNotification=" + idNotification +
                ", message='" + message + '\'' +
                ", type='" + type + '\'' +
                ", dateEnvoi=" + getFormattedDateEnvoi() +
                ", berceau=" + (berceau != null ? berceau.getNom() : "N/A") +
                ", parent=" + (parent != null ? parent.getNom() : "N/A") +
                '}';
    }
}
