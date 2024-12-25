package com.example.appmobile.model.entity;

import android.util.Log;

import java.util.Set;


public class Parent {
    private Integer idParent;
    private String nom;
    private String prenom;
    private String email;
    private String password;

    private Set<Bebe> bebes;

    public Parent() {
    }

    public Parent(String nom, String prenom, String email) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
    }

    public Parent(String nom, String prenom) {
        this.nom = nom;
        this.prenom = prenom;
    }


    public String getFullName() {
        return prenom + " " + nom;
    }

    public void inscrire() {
        System.out.println("inscrire");
    }

    public void seConnecter() {
        System.out.println("se connecter");
    }

    public void seDeconnecter() {
        Log.d("deconecter","Le parent " + getFullName() + " se deconnecter");
    }

    public Integer getIdParent() {
        return idParent;
    }

    public void setIdParent(Integer idParent) {
        this.idParent = idParent;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Bebe> getBebes() {
        return bebes;
    }

    public void setBebes(Set<Bebe> bebes) {
        this.bebes = bebes;
    }
}
