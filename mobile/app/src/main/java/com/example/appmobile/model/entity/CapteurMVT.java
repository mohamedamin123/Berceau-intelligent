package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public class CapteurMVT extends Capteur{

    private boolean mvtDect;

    public CapteurMVT() {
        this.setName("CapteurMVT");
        this.setEtat(true);
        this.setPin(18);
        this.mvtDect=false;


    }

    public boolean getMvtDect() {
        return mvtDect;
    }

    public void setMvtDect(boolean mvtDect) {
        this.mvtDect = mvtDect;
    }

    @Override
    public void send_data(String endpoint) {

    }
}
