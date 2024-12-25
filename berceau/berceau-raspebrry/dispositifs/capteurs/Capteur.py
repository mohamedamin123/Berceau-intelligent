from abc import ABC, abstractmethod
from dispositifs.Dispositif import Dispositif

class Capteur(Dispositif, ABC):  # Hérite de Dispositif et est également abstraite
    def __init__(self, pin, name, etat):
        super().__init__(pin, name, etat)

    @abstractmethod
    def envoyerDonne(self, token):
        """Méthode abstraite pour envoyer des données."""
        pass

    @abstractmethod
    def recevoirDonne(self, token):
        """Méthode abstraite pour recevoir des données."""
        pass
