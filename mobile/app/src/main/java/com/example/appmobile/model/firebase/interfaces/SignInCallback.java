package com.example.appmobile.model.firebase.interfaces;

import com.google.firebase.auth.FirebaseUser;

public interface SignInCallback {

    void onSuccess(FirebaseUser user);
    void onFailure(Exception e);
}
