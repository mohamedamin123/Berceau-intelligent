//Imporatation 
const express = require("express");
const port = 9000;
const cors = require("cors");

const userRoutes=require("./routes/userRoute");
const bebeRoutes=require("./routes/bebeRoute");
const berceauRoutes=require("./routes/berceauRoute");
const notificationRoutes=require("./routes/notificationRoute");

const dhtRoutes=require("./routes/capteurs/DHTRoute");
const mouvementRoutes=require("./routes/capteurs/mouvementRoute");
const ledRoutes=require("./routes/actionnaires/ledRoute");



//creation instance de objet express
const app = express();

app.use(cors()); // Autoriser les requêtes CORS depuis Angular

//utiliser format JSON
app.use(express.json());
//Les routes firesotire
app.use("/users",userRoutes);
app.use("/bebes",bebeRoutes);
app.use("/berceaux",berceauRoutes);
app.use("/notifications",notificationRoutes);

//Les routes realtime
app.use("/dhts",dhtRoutes);
app.use("/mouvements",mouvementRoutes);
app.use("/leds",ledRoutes);





app.listen(port, () => {
    try {
        console.log("the server is running !!!");
    } catch (error) {
        console.log(error);
    }
});

