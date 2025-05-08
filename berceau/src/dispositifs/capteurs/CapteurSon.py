from Ia.BabyCryDetection import BabyCryClassifier
from dispositifs.capteurs.Capteur import Capteur
from gpiozero import DigitalInputDevice
from time import sleep
from communication.SonAPI import SonAPI
import sounddevice as sd
from scipy.io.wavfile import write
import os
import librosa
import numpy as np
import sounddevice as sd
from scipy.io.wavfile import write
class CapteurSon(Capteur):
    def __init__(self, pin=17, modele="cnn_model.h5"):
        self.microphone = DigitalInputDevice(pin)
        self.api = SonAPI()
        self.etat_precedent = False
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../Ia", modele))
        self.classifier = BabyCryClassifier(model_path)

    def lire_donnees(self):
        try:
            return self.microphone.value == 1
        except RuntimeError as e:
            print(f"Erreur de lecture du capteur de son : {e}")
            return None



    def enregistrer_audio(self, nom_fichier="enregistrement.wav", duree=6, frequence_enregistrement=44100, frequence_finale=22050):
        print("Enregistrement en cours...")

        # Enregistre � 44100 Hz
        audio = sd.rec(int(duree * frequence_enregistrement), samplerate=frequence_enregistrement, channels=1, dtype='float32')
        sd.wait()
        audio = np.squeeze(audio)  # Transforme (N, 1) en (N,)

        # V�rifie s'il faut resampler
        if frequence_enregistrement != frequence_finale:
            audio = librosa.resample(audio, orig_sr=frequence_enregistrement, target_sr=frequence_finale)

        # Normalise entre -1 et 1 avant conversion
        audio = audio / np.max(np.abs(audio))

        # Convertit en int16 (format standard WAV)
        audio_int16 = (audio * 32767).astype(np.int16)

        # Sauvegarde � frequence_finale
        write(nom_fichier, frequence_finale, audio_int16)

        print(f"Enregistrement termin� et sauvegard� dans : {nom_fichier}")
        return nom_fichier



    def envoyer_donnees(self, berceau_id):
        
            print("valeur :",self.microphone.value)
            valeur_son = self.lire_donnees()
            if valeur_son and not self.etat_precedent:
                # Changement de silence � brui
                fichier = self.enregistrer_audio()
                classe,proba = self.classifier.predict(fichier)
                type_prediction = classe if classe is not None else ""
                for k, v in proba.items():
                    print(f"  {k} : {v:.2f}")
                data = {
                    "etat": True,
                    "type": type_prediction
                }
                response = self.api.save_son_data(berceau_id, data)
                print(f"Donn�es envoy�es : {response}")

                self.etat_precedent = True
                sleep(10)

                # R�initialiser l'�tat apr�s 10 secondes
                data = {
                    "etat": False,
                    "type": ""
                }
                response = self.api.save_son_data(berceau_id, data)
                print(f"Donn�es envoy�es : {response}")
                self.etat_precedent = False

            sleep(0.1)  # pause l�g�re

    def obtenir_son(self, berceau_id):
        return self.api.get_son_data(berceau_id)
