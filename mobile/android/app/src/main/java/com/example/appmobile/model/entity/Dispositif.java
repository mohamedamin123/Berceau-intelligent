package com.example.appmobile.model.entity;


import java.io.Serializable;

public  class  Dispositif implements Serializable {

    private int pin;
    private String name;
    private Boolean etat;


    public Dispositif() {
    }

    public Dispositif(int pin, String name, Boolean etat) {
        this.pin = pin;
        this.name = name;
        this.etat = etat;
    }

    public int getPin() {
        return pin;
    }

    public void setPin(int pin) {
        this.pin = pin;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getEtat() {
        return etat;
    }

    public void setEtat(Boolean etat) {
        this.etat = etat;
    }

    public void initialiser(int pin, String name) {
        System.out.println("la dispositif "+name+" est donctionnement dans pin "+pin);
        this.etat = true;
    }



    public String afficherInfo() {
        return "pin : "+pin+" name : "+name + " etat : "+etat;
    }



}
