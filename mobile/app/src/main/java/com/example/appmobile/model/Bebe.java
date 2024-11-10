package com.example.appmobile.model;

public class Bebe {
    private int lait;
    private int dormir;
    private int repas;
    private int couche;

    public Bebe(int lait, int dormir, int repas, int couche) {
        this.lait = lait;
        this.dormir = dormir;
        this.repas = repas;
        this.couche = couche;
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
}
