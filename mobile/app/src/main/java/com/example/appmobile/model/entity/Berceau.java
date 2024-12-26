package com.example.appmobile.model.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Berceau implements Serializable {

    private int id;
    private String nom;
    private boolean etat;

    // Use a Map to store devices by their class names
    private Map<String, Dispositif> dispositifs;

    private Bebe bebe;

    public Berceau() {
        this.dispositifs = new HashMap<>();
    }

    public Berceau(int id, String nom, boolean etat) {
        this.id = id;
        this.nom = nom;
        this.etat = etat;
        this.dispositifs = new HashMap<>();
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public boolean isEtat() {
        return etat;
    }

    public void setEtat(boolean etat) {
        this.etat = etat;
    }

    public Map<String, Dispositif> getDispositifs() {
        return dispositifs;
    }

    public void setDispositifs(Map<String, Dispositif> dispositifs) {
        this.dispositifs = dispositifs;
    }

    public Bebe getBebe() {
        return bebe;
    }

    public void setBebe(Bebe bebe) {
        this.bebe = bebe;
    }

    // Add a dispositif by its class name
    public void ajouterDispositif(Dispositif dispositif) {
        this.dispositifs.put(dispositif.getClass().getSimpleName(), dispositif);
    }

    // Update the state of all dispositifs
    public void mettreAJourEtat(boolean nouvelEtat) {
        this.etat = nouvelEtat;
        for (Dispositif dispositif : dispositifs.values()) {
            dispositif.setEtat(nouvelEtat);
        }
    }

    // Display information
    public void afficherInfos() {
        System.out.println("Berceau [id=" + id + ", nom=" + nom + ", etat=" + (etat ? "Actif" : "Inactif") + "]");
        for (Dispositif dispositif : dispositifs.values()) {
            System.out.println("  -> " + dispositif.afficherInfo());
        }
    }

    @Override
    public String toString() {
        return "Berceau{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", etat=" + etat +
                ", bebe=" + bebe.toString() +
                ", dispositifs=" + dispositifs +
                '}';
    }
}

