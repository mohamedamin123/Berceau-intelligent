package com.example.appmobile.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Convertit {

    public static int convertirStringToInt(String str) {
        int idBerceau = 0;

        Pattern pattern = Pattern.compile("\\d+"); // Rechercher des chiffres
        Matcher matcher = pattern.matcher(str);

        if (matcher.find()) {
            idBerceau = Integer.parseInt(matcher.group()); // Convertir en entier
            System.out.println("ID Berceau : " + idBerceau);
            return idBerceau;
        }
        return idBerceau;
    }
}
