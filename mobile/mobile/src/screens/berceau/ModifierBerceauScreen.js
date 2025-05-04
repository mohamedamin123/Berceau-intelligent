import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, FlatList
} from "react-native";
import { getBerceauById } from "../../services/BerceauService";
import { createBebe } from "../../services/BebeService";
import useAuthStore from "../../store/useAuthStore";
import { useRoute } from "@react-navigation/native";
import { getBebeByBerceauId } from "../../services/BebeService"; // nouvelle fonction à ajouter
import { updateBerceau } from "../../services/BerceauService"; // si tu ne l'as pas déjà
import { useNavigation } from '@react-navigation/native';

const ModifierBerceauScreen = () => {
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [sexe, setSexe] = useState("M");
  const [loading, setLoading] = useState(false);
  const [anciensBebes, setAnciensBebes] = useState([]);
  const user = useAuthStore((state) => state.user);
  const route = useRoute();
  const { berceauId } = route.params;
    const navigation = useNavigation();

  useEffect(() => {
    const loadBebes = async () => {
      try {
        const res = await getBebeByBerceauId(berceauId);
        setAnciensBebes(res.data); // tu reçois bien une liste de bébés
      } catch (err) {
        console.error("Erreur chargement bébés:", err);
      }
    };
    loadBebes();
  }, [berceauId]);
  const validate = () => {
    return nom && dateNaissance.match(/^\d{2}-\d{2}-\d{4}$/);
  };

  const handleAdd = async () => {
    if (!validate()) return alert("Veuillez remplir correctement les champs.");
  
    setLoading(true);
    const [jour, mois, annee] = dateNaissance.split("-");
    const bebe = {
      prenom: nom,
      dateNaissance: `${annee}-${mois}-${jour}`,
      sexe,
      parentId: user?.id,
      berceauId,
    };
    try {
      await createBebe(bebe);
  
      // Met à jour le nom du berceau avec le prénom du bébé ajouté
      const newName = `Berceau de ${nom}`;
      await updateBerceau(berceauId, { name: newName });
  
      alert("Bébé ajouté et berceau mis à jour !");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Erreur ajout bébé ou mise à jour berceau:", err);
      alert("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };
  

  // Contenu complet de l'écran dans un tableau pour FlatList
  const formContent = [
    { key: "title", render: () => <Text style={styles.title}>Ajouter un bébé 🍼</Text> },
    { key: "section", render: () => <Text style={styles.section}>Bébés déjà associés :</Text> },
    ...anciensBebes.map((bebe, i) => ({
      key: `bebe-${i}`,
      render: () => (
        <View style={styles.babyCard}>
          <Text style={styles.babyText}>{bebe.prenom} ({bebe.sexe})</Text>
          <Text style={styles.babyDate}>Né(e) le {bebe.dateNaissance}</Text>
        </View>
      )
    })),
    { key: "add-section", render: () => <Text style={styles.section}>Ajouter un nouveau</Text> },
    {
      key: "nom",
      render: () => (
        <TextInput
          style={styles.input}
          placeholder="Prénom du bébé"
          value={nom}
          onChangeText={setNom}
        />
      ),
    },
    {
      key: "date",
      render: () => (
        <TextInput
          style={styles.input}
          placeholder="Date de naissance (JJ-MM-AAAA)"
          value={dateNaissance}
          onChangeText={(text) => {
            let formatted = text.replace(/[^0-9]/g, "");
            if (formatted.length > 2) formatted = formatted.slice(0, 2) + "-" + formatted.slice(2);
            if (formatted.length > 5) formatted = formatted.slice(0, 5) + "-" + formatted.slice(5, 9);
            setDateNaissance(formatted);
          }}
          keyboardType="numeric"
          maxLength={10}
        />
      ),
    },
    {
      key: "radio",
      render: () => (
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, sexe === "F" && styles.selectedF]}
            onPress={() => setSexe("F")}
          >
            <Text style={styles.radioText}>👧 Fille</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, sexe === "M" && styles.selectedM]}
            onPress={() => setSexe("M")}
          >
            <Text style={styles.radioText}>👦 Garçon</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: "button",
      render: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ajouter le bébé</Text>
          )}
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <FlatList
      data={formContent}
      renderItem={({ item }) => item.render()}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF0F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CB68DD",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginVertical: 10,
  },
  babyCard: {
    backgroundColor: "#FFE4FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  babyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  babyDate: {
    fontSize: 14,
    color: "#777",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#e6e6e6",
  },
  selectedF: {
    backgroundColor: "#FFC0CB",
  },
  selectedM: {
    backgroundColor: "#ADD8E6",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#CB68DD",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ModifierBerceauScreen;
