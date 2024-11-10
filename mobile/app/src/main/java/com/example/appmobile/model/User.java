package com.example.appmobile.model;

public class User {

    private Integer idUser;
    private String nom;
    private String  prenom;
    private String email;
    private float tmp;
    private float hmd;
    private boolean led1;
    private boolean servo;
    private boolean clim;

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

    public User(String nom, String prenom, String email, float tmp, float hmd, boolean led1,boolean servo,boolean clim) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.tmp = tmp;
        this.hmd = hmd;
        this.led1 = led1;
        this.servo=servo;
        this.clim=clim;
    }

    public boolean isLed1() {
        return led1;
    }

    public void setLed1(boolean led1) {
        this.led1 = led1;
    }

    public boolean isServo() {
        return servo;
    }

    public void setServo(boolean servo) {
        this.servo = servo;
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

    public boolean isClim() {
        return clim;
    }

    public void setClim(boolean clim) {
        this.clim = clim;
    }
}
