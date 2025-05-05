from abc import ABC, abstractmethod

from dispositifs.Berceau import Berceau


class Capteur(Berceau,ABC):

    @abstractmethod
    def lire_donnees(self):
        pass
    @abstractmethod
    def envoyer_donnees(self, berceau_id):
        pass
