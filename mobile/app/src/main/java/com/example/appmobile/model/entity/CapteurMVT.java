package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor // Génère un constructeur avec tous les champs
@Getter
@Setter
@ToString
public class CapteurMVT extends Capteur{

    public CapteurMVT() {
        this.setName("CapteurMVT");
        this.setEtat(true);
        this.setPin(18);

    }

    private boolean mvtDect;

    public boolean lireMvt() {
        return this.mvtDect;
    }


    public boolean isMvtDect() {
        return mvtDect;
    }

    public void setMvtDect(boolean mvtDect) {
        this.mvtDect = mvtDect;
    }

    @Override
    public void send_data(String endpoint) {

    }
}
