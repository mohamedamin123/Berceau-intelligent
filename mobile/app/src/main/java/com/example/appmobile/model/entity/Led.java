package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public class Led extends Actionnaire{

    private String couleur;
    private int nbrLed;
    private int intensite;

    public Led() {
        this.setPin(4);
        this.setName("Led");
        this.setEtat(true);
        this.setNbrLed(1);
        this.setCouleur("Rouge");
        this.setIntensite(0);
    }


    public String getCouleur() {
        return couleur;
    }

    public void setCouleur(String couleur) {
        this.couleur = couleur;
    }

    public int getNbrLed() {
        return nbrLed;
    }

    public void setNbrLed(int nbrLed) {
        this.nbrLed = nbrLed;
    }

    public int getIntensite() {
        return intensite;
    }

    public void setIntensite(int intensite) {
        this.intensite = intensite;
    }

    public void ajusterIntensite(int  intensite) {
        this.setIntensite(intensite);
        System.out.println("L'intensité des LEDs est modifiée à "+intensite+" dans le pin "+this.getPin());
    }


}
