package com.example.appmobile.model.firebase.interfaces;


// Interface générique pour les callbacks des opérations Firebase
public interface DataCallback<T> {


    void onSuccess(T data);


    void onFailure(Exception e);
}