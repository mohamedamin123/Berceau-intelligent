from gpiozero import Device
from abc import ABC, abstractmethod

class Dispositif(ABC):  # Classe abstraite
    def __init__(self, pin, name, etat=False):
        self.pin = pin
        self.name = name
        self.etat = etat
        self.device = None  # Instance GPIOZero du dispositif (initialisé dans les classes dérivées)

    @abstractmethod
    def initialiser(self):
        """Méthode abstraite pour initialiser le dispositif."""
        pass

    def afficherInfo(self):
        etat = "marche" if self.etat else "arrete"
        return f"Pin utilisé : {self.pin}, Nom du dispositif : {self.name}, État : {etat}"
