from abc import ABC, abstractmethod


class Actionnaire(ABC):

    @abstractmethod
    def allumer(self,berceau_id):
        pass

    @abstractmethod
    def eteindre(self, berceau_id):
        pass
    
    @abstractmethod
    def obtenir_statut(self, berceau_id):
        pass