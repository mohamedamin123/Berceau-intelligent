import numpy as np
import librosa
import tensorflow as tf

class BabyCryClassifier:
    def __init__(self, model_path, label_map=None):
        self.model = tf.keras.models.load_model(model_path)
        self.label_map = label_map or {
            0: 'fatiguée',
            1: 'rots',
            2: 'affamée',
            3: 'douleur au ventre',
            4: 'inconfort'
        }

    def extract_mfcc(self, file_path, max_pad_length=100, sample_rate=22050, n_mfcc=40):
        try:
            y, sr = librosa.load(file_path, sr=sample_rate)

            # V�rifie que le fichier audio est assez long
            if len(y) < sample_rate:  # Moins d'1 seconde
                print("?? Audio trop court pour analyse")
                return None

            # Extraction MFCC + delta + delta�
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
            delta = librosa.feature.delta(mfcc)
            delta2 = librosa.feature.delta(mfcc, order=2)
            mfcc = np.concatenate((mfcc, delta, delta2))  # Shape (120, time)

            # Standardisation
            mfcc = (mfcc - np.mean(mfcc)) / np.std(mfcc)

            # Fixe � max_pad_length frames
            mfcc = librosa.util.fix_length(mfcc, size=max_pad_length, axis=1)

            return mfcc

        except Exception as e:
            print(f"Erreur avec {file_path} : {e}")
            return None

    def predict(self, file_path):
        mfcc = self.extract_mfcc(file_path)
        if mfcc is None:
            return None, None

        # Pr�traitement : aplatir et reshape
        mfcc = mfcc.flatten().reshape(1, -1).astype('float32')

        # ?? PAS de double normalisation : d�j� standardis�
        # Si vraiment n�cessaire, fais :
        # mfcc = mfcc / (np.max(np.abs(mfcc)) + 1e-6)

        # Pr�diction
        predictions = self.model.predict(mfcc)
        predicted_index = np.argmax(predictions[0])
        predicted_class = self.label_map.get(predicted_index, "Classe inconnue")

        # Probabilit�s d�taill�es
        class_probabilities = {
            self.label_map.get(i, f"Classe {i}"): float(prob)
            for i, prob in enumerate(predictions[0])
        }

        return predicted_class, class_probabilities
