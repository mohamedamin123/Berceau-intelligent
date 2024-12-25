package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor // Génère un constructeur avec tous les champs
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CapteurMVT extends Capteur{



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
