from Dispositif import Dispositif

class Actionnaire(Dispositif):

    def __init__(self, pin, name, etat):
        super().__init__(pin, name, etat)

    def envoyerDonne(self,name):
        pass

    def recevoirDonne(self):
        pass

    def arreter(self):
        pass

    def demarrer(self):
        pass