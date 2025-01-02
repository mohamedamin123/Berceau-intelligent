package com.example.appmobile.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


public class CapteurDHT extends Capteur{


    private String type;
    private float tmp;
    private float hmd;

    public CapteurDHT() {
        this.setName("CapteurDHT");
        this.setEtat(true);
        this.setPin(14);

    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public float getTmp() {
        return tmp;
    }

    public void setTmp(float tmp) {
        this.tmp = tmp;
    }

    public float getHmd() {
        return hmd;
    }

    public void setHmd(float hmd) {
        this.hmd = hmd;
    }

    @Override
    public void send_data(String endpoint) {

    }
}
