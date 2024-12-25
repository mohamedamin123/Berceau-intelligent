from Dispositif import Dispositif

class Capteur(Dispositif):

    def __init__(self, pin, name, etat):
        super().__init__(pin, name, etat)


    def envoyerDonne(self,token):
        pass

    def recevoirDonne(self, token):
        pass
