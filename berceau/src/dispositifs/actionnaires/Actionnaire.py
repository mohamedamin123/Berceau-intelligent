from abc import ABC, abstractmethod
from dispositifs.Berceau import Berceau

class Actionnaire(Berceau, ABC):

    @abstractmethod
    def allumer(self, berceau_id):
        pass

    @abstractmethod
    def eteindre(self, berceau_id):
        pass

    @abstractmethod
    def obtenir_statut(self, berceau_id):
        pass
