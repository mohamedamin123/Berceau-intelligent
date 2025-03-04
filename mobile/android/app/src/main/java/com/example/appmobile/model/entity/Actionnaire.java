package com.example.appmobile.model.entity;


public abstract class  Actionnaire extends Dispositif {

    public void arreter() {
        this.setEtat(false);
        System.out.println("le actionnaire "+this.getName()+" est arrêté dans pin "+this.getPin());
    }

    public void demarrer() {
        this.setEtat(true);
        System.out.println("le actionnaire "+this.getName()+" est démarré dans pin "+this.getPin());
    }

    public void changeEtat(String nom) {
        if(this.getEtat()){
            this.setEtat(false);
            System.out.println("Le "+nom+" du actionnaire "+this.getName()+" est éteint dans le pin "+this.getPin());
        } else{
            this.setEtat(true);
            System.out.println("Le "+nom+"  du actionnaire "+this.getName()+" est allumé dans le pin "+this.getPin());
        }
    }

    public  void envoyerEtat() {
        System.out.println("ecrire code envoyer etat dans actionnaire");
    }



}
