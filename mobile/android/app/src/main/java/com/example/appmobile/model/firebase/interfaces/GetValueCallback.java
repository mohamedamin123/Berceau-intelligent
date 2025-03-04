package com.example.appmobile.model.firebase.interfaces;

public interface GetValueCallback<T> {
    void onValueReceived(T t);

    void onFailure(Exception e);
}
