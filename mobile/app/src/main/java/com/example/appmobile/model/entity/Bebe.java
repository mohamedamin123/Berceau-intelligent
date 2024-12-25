package com.example.appmobile.model.entity;


import java.util.Date;

public class Bebe {
    private Integer idBebe;
    private String prenom;
    private Date date;
    private int lait;
    private int dormir;
    private int repas;
    private int couche;

    private Parent parent;

    public Bebe() {
    }

    public Bebe(int lait, int dormir, int repas, int couche) {
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
    }

    public Bebe(String prenom,Date date ,int lait, int dormir, int repas, int couche, Parent parent) {
        this.prenom = prenom;
        this.date = date;
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
        this.parent = parent;
    }

    public Bebe(Integer idBebe, String prenom, Date date, int lait, int dormir, int repas, int couche) {
        this.idBebe = idBebe;
        this.prenom = prenom;
        this.date = date;
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;

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

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String nom) {
        this.prenom = nom;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Bebe{" +
                "idBebe=" + idBebe +
                ", prenom='" + prenom + '\'' +
                ", date=" + date +
                ", lait=" + lait +
                ", dormir=" + dormir +
                ", repas=" + repas +
                ", couche=" + couche +
                ", parent=" + parent +
                '}';
    }
}
