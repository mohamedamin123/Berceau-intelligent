
class Dispositif:
    def __init__(self,pin,name,etat):
        self.pin=pin
        self.name=name
        self.etat=etat

    
    def initialiser(self,pin):
        pass

    def afficherInfo(self):
        if(self.etat):
            etat="marche"
        else:
            etat="arrete"

        return (f"pin utiliser est : {self.pin} et name de dispositif est {self.name} et etat {etat}")
        