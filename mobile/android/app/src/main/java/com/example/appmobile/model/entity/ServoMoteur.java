package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public class ServoMoteur extends Actionnaire{

    private int position;
    private String mode;


    public ServoMoteur() {
        this.setName("ServoMoteur");
        this.setEtat(true);
        this.setMode("Manuelle");
        this.setPin(15);

    }

    public void deplacer(int position) {
        this.setPosition(position);
        System.out.println("La position du servomoteur est modifiée à "+position+" dans le pin "+this.getPin());
    }

    public void changerMode() {
        this.setMode(mode.equals("Automatique") ? "Manuelle" : "Automatique");
        System.out.println("Le mode du servomoteur est modifié à "+mode+" dans le pin "+this.getPin());
    }

    public void afficherPosition() {
        System.out.println("La position actuelle du servomoteur dans le pin "+this.getPin()+" est : "+position);
    }


    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }
}
