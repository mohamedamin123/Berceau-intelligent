from communication.BerceauAPI import BerceauAPI

class Berceau:
    def __init__(self, id):
        self.api = BerceauAPI()
        self.obtenir_statut(id)

    def obtenir_statut(self, id):
        statut = self.api.get_data(id)
        self.etat = statut.get("etat")
        self.name = statut.get("name")
        self.idBerceau = statut.get("idBerceau")

    def __str__(self):
        return f"Berceau(idBerceau={self.idBerceau}, name='{self.name}', etat='{self.etat}')"
