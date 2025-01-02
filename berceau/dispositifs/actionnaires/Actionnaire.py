from abc import ABC, abstractmethod
from dispositifs.Dispositif import Dispositif

class Actionnaire(Dispositif, ABC):  # Hérite de Dispositif et est également abstraite
    def __init__(self, pin, name, etat):
        super().__init__(pin, name, etat)

    @abstractmethod
    def envoyerDonne(self, name):
        """Méthode abstraite pour envoyer des données à l'actionneur."""
        pass

    @abstractmethod
    def recevoirDonne(self):
        """Méthode abstraite pour recevoir des données de l'actionneur."""
        pass

    @abstractmethod
    def arreter(self):
        """Méthode abstraite pour arrêter l'actionneur."""
        pass

    @abstractmethod
    def demarrer(self):
        """Méthode abstraite pour démarrer l'actionneur."""
        pass
