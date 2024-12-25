package com.example.appmobile.model.entity;


public abstract class Capteur extends Dispositif {

    public abstract void send_data(String endpoint);
}
