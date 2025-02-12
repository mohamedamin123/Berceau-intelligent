package com.example.appmobile.viewmodel;

import androidx.lifecycle.ViewModel;
import android.os.CountDownTimer;

public class TimerViewModel extends ViewModel {
    private CountDownTimer laitTimer, dormirTimer, repasTimer, coucheTimer;
    private long laitElapsedTime = 0;
    private long dormirElapsedTime = 0;
    private long repasElapsedTime = 0;
    private long coucheElapsedTime = 0;

    // Getters et setters pour les timers et les temps écoulés
    public CountDownTimer getLaitTimer() { return laitTimer; }
    public void setLaitTimer(CountDownTimer laitTimer) { this.laitTimer = laitTimer; }
    public long getLaitElapsedTime() { return laitElapsedTime; }
    public void setLaitElapsedTime(long laitElapsedTime) { this.laitElapsedTime = laitElapsedTime; }

    public CountDownTimer getDormirTimer() { return dormirTimer; }
    public void setDormirTimer(CountDownTimer dormirTimer) { this.dormirTimer = dormirTimer; }
    public long getDormirElapsedTime() { return dormirElapsedTime; }
    public void setDormirElapsedTime(long dormirElapsedTime) { this.dormirElapsedTime = dormirElapsedTime; }

    public CountDownTimer getRepasTimer() { return repasTimer; }
    public void setRepasTimer(CountDownTimer repasTimer) { this.repasTimer = repasTimer; }
    public long getRepasElapsedTime() { return repasElapsedTime; }
    public void setRepasElapsedTime(long repasElapsedTime) { this.repasElapsedTime = repasElapsedTime; }

    public CountDownTimer getCoucheTimer() { return coucheTimer; }
    public void setCoucheTimer(CountDownTimer coucheTimer) { this.coucheTimer = coucheTimer; }
    public long getCoucheElapsedTime() { return coucheElapsedTime; }
    public void setCoucheElapsedTime(long coucheElapsedTime) { this.coucheElapsedTime = coucheElapsedTime; }
}