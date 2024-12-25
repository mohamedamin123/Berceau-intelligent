package com.example.appmobile.model.entity;


public class Bebe {
    private Integer idBebe;
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



}
