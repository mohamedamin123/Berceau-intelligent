package com.example.appmobile.model;

public class User {

    private Integer idUser;
    private String nom;
    private String  prenom;
    private String email;
    private float tmp;
    private float hmd;
    private int led1;

    public User() {
    }

    public User(String prenom, String nom, String email) {
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
    }

    public User(Integer idUser, String nom, String prenom, String email) {
        this(prenom, nom, email);
        this.idUser = idUser;
    }

    public User(String nom, String prenom, String email, float tmp, float hmd, int led1) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.tmp = tmp;
        this.hmd = hmd;
        this.led1 = led1;
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

    public int isLed1() {
        return led1;
    }

    public void setLed1(int led1) {
        this.led1 = led1;
    }

    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
