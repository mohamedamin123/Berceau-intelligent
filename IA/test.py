import numpy as np
import librosa
import tensorflow as tf

# Charger le modèle CNN sauvegardé
cnn_model = tf.keras.models.load_model('cnn_model.h5')

# Mettre à jour le label_map pour inclure les 5 classes
label_map = {0: 'tired', 1: 'burping', 2: 'hungry', 3: 'belly_pain', 4: 'discomfort'}

# Fonction pour extraire les MFCC
def extract_mfcc(file_path, max_pad_length=100, sample_rate=22050, n_mfcc=40):
    try:
        y, sr = librosa.load(file_path, sr=sample_rate)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        delta = librosa.feature.delta(mfcc)
        delta2 = librosa.feature.delta(mfcc, order=2)
        mfcc = np.concatenate((mfcc, delta, delta2))
        mfcc = (mfcc - np.mean(mfcc)) / np.std(mfcc)
        mfcc = librosa.util.fix_length(mfcc, size=max_pad_length, axis=1)
        return mfcc
    except Exception as e:
        print(f"Erreur avec {file_path} : {e}")
        return None

# Fonction de prédiction
def predict_audio_class(file_path, model, label_map):
    mfcc = extract_mfcc(file_path)
    if mfcc is None:
        return None, None

    # Aplatir les MFCC pour correspondre à la forme attendue par le modèle (12000 éléments)
    mfcc = mfcc.flatten().reshape(1, -1)  # Aplatir et redimensionner

    # Normalisation
    mfcc = mfcc.astype('float32') / np.max(mfcc)

    # Prédiction
    predictions = model.predict(mfcc)
    predicted_index = np.argmax(predictions[0])

    # Trouver la classe prédite à partir de l'index
    predicted_class = label_map.get(predicted_index, "Classe inconnue")

    # Calculer les probabilités par classe
    class_probabilities = {
        label_map.get(i, f"Classe {i}"): float(prob)
        for i, prob in enumerate(predictions[0])
    }

    return predicted_class, class_probabilities

# 🧪 Test avec un fichier audio
fichier_audio = "belly2.wav"  # <-- à modifier
classe, proba = predict_audio_class(fichier_audio, cnn_model, label_map)

print(f"\nClasse prédite : {classe}")
print("Probabilités :")
for k, v in proba.items():
    print(f"  {k} : {v:.2f}")
