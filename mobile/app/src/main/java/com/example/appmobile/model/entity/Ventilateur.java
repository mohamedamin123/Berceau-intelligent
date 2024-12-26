package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public class Ventilateur extends Actionnaire{

    private String mode;
    private int tmpSuhaite;


    public Ventilateur() {
        this.setName("Ventilateur");
        this.setEtat(true);
        this.setMode("Manuelle");

    }

    public void changerMode() {
        this.setMode(mode.equals("Automatique") ? "Manuelle" : "Automatique");
        System.out.println("Le mode du ventilateur est modifié à "+mode+" dans le pin "+this.getPin());
    }

    public void reglerTemperatureSuhaite(int tmpSuhaite) {
        this.setTmpSuhaite(tmpSuhaite);
        System.out.println("La température de souhait du ventilateur est modifiée à "+tmpSuhaite+" dans le pin "+this.getPin());
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public int getTmpSuhaite() {
        return tmpSuhaite;
    }

    public void setTmpSuhaite(int tmpSuhaite) {
        this.tmpSuhaite = tmpSuhaite;
    }
}
