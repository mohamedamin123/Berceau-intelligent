package com.example.appmobile.firebase;

public interface LedValueCallback {
    void onValueReceived(Integer value);
    void onFailure(Exception e);
}
