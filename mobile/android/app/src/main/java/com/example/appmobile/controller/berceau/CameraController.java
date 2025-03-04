package com.example.appmobile.controller.berceau;

import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import com.example.appmobile.databinding.ActivityCameraBinding;
import com.example.appmobile.view.accueil.berceau.CameraActivity;

public class CameraController implements View.OnClickListener {

    private CameraActivity activity;
    private ActivityCameraBinding binding;

    public CameraController(CameraActivity activity, ActivityCameraBinding binding) {
        this.activity = activity;
        this.binding = binding;
    }

    public void startVideoStream() {
        String videoUrl = "http://"+getUrl()+":5000/video_feed";

        WebSettings webSettings = binding.webView.getSettings();
        webSettings.setJavaScriptEnabled(true); // Active JavaScript si nécessaire
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        binding.webView.setWebViewClient(new WebViewClient()); // Permet de charger l'URL dans l'application
        binding.webView.loadUrl(videoUrl);
    }

    private String getUrl() {
        return "192.168.31.169";
    }


    @Override
    public void onClick(View v) {

    }
}
