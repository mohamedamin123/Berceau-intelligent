package com.example.appmobile.utils;

public class UperName {

    public static String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        String[] words = text.split(" "); // Diviser le texte en mots
        StringBuilder capitalizedText = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                // Mettre en majuscule la première lettre et le reste en minuscule
                capitalizedText.append(word.substring(0, 1).toUpperCase())
                        .append(word.substring(1).toLowerCase())
                        .append(" "); // Ajouter un espace entre les mots
            }
        }

        // Supprimer l'espace final inutile
        return capitalizedText.toString().trim();
    }

}
