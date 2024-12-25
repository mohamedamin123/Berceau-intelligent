package com.example.appmobile.model.entity;

import java.util.ArrayList;
import java.util.List;


public class Berceau {

    private int id;
    private String nom;
    private boolean etat;

    //relation avec dispositif
    private List<Dispositif> dispositifs; // Liste des dispositifs associés

    public Berceau(int id, String nom, boolean etat) {
        this.id = id;
        this.nom = nom;
        this.etat = etat;
        this.dispositifs = new ArrayList<>();
    }

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

    public List<Dispositif> getDispositifs() {
        return dispositifs;
    }

    public void setDispositifs(List<Dispositif> dispositifs) {
        this.dispositifs = dispositifs;
    }

    public void ajouterDispositif(Dispositif dispositif) {
        this.dispositifs.add(dispositif);
    }


    public void mettreAJourEtat(boolean nouvelEtat) {
        this.etat = nouvelEtat;
        for (Dispositif dispositif : dispositifs) {
            dispositif.setEtat(nouvelEtat);
        }
    }

    public void afficherInfos() {
        System.out.println("Berceau [id=" + id + ", nom=" + nom + ", etat=" + (etat ? "Actif" : "Inactif") + "]");
        for (Dispositif dispositif : dispositifs) {
            System.out.println("  -> " + dispositif.afficherInfo());
        }
    }
}
