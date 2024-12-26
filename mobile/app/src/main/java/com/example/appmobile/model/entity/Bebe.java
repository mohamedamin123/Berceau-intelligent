package com.example.appmobile.model.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Bebe implements Serializable {
    private Integer idBebe;
    private String prenom;
    private String dateNaissance; // Store date as String
    private int lait;
    private int dormir;
    private int repas;
    private int couche;

    private Parent parent;

    // Default constructor
    public Bebe() {
    }

    // Constructor with prenom and dateNaissance as LocalDate
    public Bebe(String prenom, String dateNaissance) {
        // Format the date to the desired format
        this.prenom = prenom;
        this.dateNaissance=dateNaissance;
    }

    // Constructor with other fields
    public Bebe(int lait, int dormir, int repas, int couche) {
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
    }

    // Constructor with all fields including date as String
    public Bebe(String prenom, String dateNaissanceString, int lait, int dormir, int repas, int couche, Parent parent) {
        this.prenom = prenom;
        this.dateNaissance = dateNaissanceString;
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
        this.parent = parent;
    }

    // Constructor with all fields including date as String
    public Bebe(Integer idBebe, String prenom, String dateNaissanceString, int lait, int dormir, int repas, int couche) {
        this.idBebe = idBebe;
        this.prenom = prenom;
        this.dateNaissance = dateNaissanceString;
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
    }

    // Convert stored string date to LocalDate when needed

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public void resetLait() {
        this.lait = 0;
    }

    public void resetDormir() {
        this.dormir = 0;
    }

    public void resetRepas() {
        this.repas = 0;
    }

    public void resetCouche() {
        this.couche = 0;
    }

    public Integer getIdBebe() {
        return idBebe;
    }

    public void setIdBebe(Integer idBebe) {
        this.idBebe = idBebe;
    }

    public String getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(String dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public int getLait() {
        return lait;
    }

    public void setLait(int lait) {
        this.lait = lait;
    }

    public int getDormir() {
        return dormir;
    }

    public void setDormir(int dormir) {
        this.dormir = dormir;
    }

    public int getRepas() {
        return repas;
    }

    public void setRepas(int repas) {
        this.repas = repas;
    }

    public int getCouche() {
        return couche;
    }

    public void setCouche(int couche) {
        this.couche = couche;
    }

    @Override
    public String toString() {
        return "Bebe{" +
                "idBebe=" + idBebe +
                ", prenom='" + prenom + '\'' +
                ", date=" + dateNaissance +
                ", lait=" + lait +
                ", dormir=" + dormir +
                ", repas=" + repas +
                ", couche=" + couche +
                ", parent=" + parent +
                '}';
    }
}
