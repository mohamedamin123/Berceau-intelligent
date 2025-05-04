from abc import ABC, abstractmethod


class Capteur(ABC):

    @abstractmethod
    def lire_donnees(self):
        pass
    @abstractmethod
    def envoyer_donnees(self, berceau_id):
        pass
