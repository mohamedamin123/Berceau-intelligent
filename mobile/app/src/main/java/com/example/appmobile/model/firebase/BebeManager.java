package com.example.appmobile.model.firebase;

import com.example.appmobile.model.firebase.interfaces.GetValueCallback;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

public class BebeManager {
    private FirebaseManager firebaseManager;
    private FirebaseUser currentUser;

    public BebeManager(FirebaseUser currentUser) {
        this.firebaseManager = new FirebaseManager();
        this.currentUser=currentUser;
    }

    public void getLait(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("lait").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer tmpValue = dataSnapshot.getValue(Integer.class);
                callback.onValueReceived(tmpValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void initLait(String chmp, GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("lait")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (!dataSnapshot.exists() || dataSnapshot.getValue() == null) {
                            // Set a default value if "lait" does not exist or is null
                            Integer defaultValue = 0; // Default value
                            firebaseManager.getDatabase().child("users").child(currentUser.getUid())
                                    .child("berceau").child(chmp).child("bebe").child("lait")
                                    .setValue(defaultValue)
                                    .addOnSuccessListener(aVoid -> callback.onValueReceived(defaultValue))
                                    .addOnFailureListener(callback::onFailure);
                        } else {
                            Integer tmpValue = dataSnapshot.getValue(Integer.class);
                            callback.onValueReceived(tmpValue);
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }


    public void getDormir(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("dormir").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer tmpValue = dataSnapshot.getValue(Integer.class);
                callback.onValueReceived(tmpValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void initDormir(String chmp, GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("dormir")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (!dataSnapshot.exists() || dataSnapshot.getValue() == null) {
                            // Set a default value if "lait" does not exist or is null
                            Integer defaultValue = 0; // Default value
                            firebaseManager.getDatabase().child("users").child(currentUser.getUid())
                                    .child("berceau").child(chmp).child("bebe").child("dormir")
                                    .setValue(defaultValue)
                                    .addOnSuccessListener(aVoid -> callback.onValueReceived(defaultValue))
                                    .addOnFailureListener(callback::onFailure);
                        } else {
                            Integer tmpValue = dataSnapshot.getValue(Integer.class);
                            callback.onValueReceived(tmpValue);
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }


    public void getRepas(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("repas").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer tmpValue = dataSnapshot.getValue(Integer.class);
                callback.onValueReceived(tmpValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void initRepas(String chmp, GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("repas")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (!dataSnapshot.exists() || dataSnapshot.getValue() == null) {
                            // Set a default value if "lait" does not exist or is null
                            Integer defaultValue = 0; // Default value
                            firebaseManager.getDatabase().child("users").child(currentUser.getUid())
                                    .child("berceau").child(chmp).child("bebe").child("repas")
                                    .setValue(defaultValue)
                                    .addOnSuccessListener(aVoid -> callback.onValueReceived(defaultValue))
                                    .addOnFailureListener(callback::onFailure);
                        } else {
                            Integer tmpValue = dataSnapshot.getValue(Integer.class);
                            callback.onValueReceived(tmpValue);
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }


    public void getCouche(String chmp,GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("couche").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Integer tmpValue = dataSnapshot.getValue(Integer.class);
                callback.onValueReceived(tmpValue);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                callback.onFailure(databaseError.toException());
            }
        });
    }

    public void initCouche(String chmp, GetValueCallback callback) {
        firebaseManager.getDatabase().child("users").child(currentUser.getUid()).child("berceau").child(chmp).child("bebe").child("couche")
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (!dataSnapshot.exists() || dataSnapshot.getValue() == null) {
                            // Set a default value if "lait" does not exist or is null
                            Integer defaultValue = 0; // Default value
                            firebaseManager.getDatabase().child("users").child(currentUser.getUid())
                                    .child("berceau").child(chmp).child("bebe").child("couche")
                                    .setValue(defaultValue)
                                    .addOnSuccessListener(aVoid -> callback.onValueReceived(defaultValue))
                                    .addOnFailureListener(callback::onFailure);
                        } else {
                            Integer tmpValue = dataSnapshot.getValue(Integer.class);
                            callback.onValueReceived(tmpValue);
                        }
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        callback.onFailure(databaseError.toException());
                    }
                });
    }
}
