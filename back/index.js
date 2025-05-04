
//Imporatation 
const express = require("express");
const port = 9000;
const cors = require("cors");

const userRoutes=require("./routes/userRoute");
const bebeRoutes=require("./routes/bebeRoute");
const berceauRoutes=require("./routes/berceauRoute");
const notificationRoutes=require("./routes/notificationRoute");
const authRoutes=require("./routes/authRoute");


const dhtRoutes=require("./routes/capteurs/DHTRoute");
const mouvementRoutes=require("./routes/capteurs/mouvementRoute");
const sonRoutes=require("./routes/capteurs/sonRoute");


const ledRoutes=require("./routes/actionnaires/ledRoute");
const servoRoutes=require("./routes/actionnaires/servoRoute");
const ventilateurRoutes=require("./routes/actionnaires/ventilateurRoute");

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
app.use("/auths",authRoutes);


//Les routes realtime
app.use("/dhts",dhtRoutes);
app.use("/mouvements",mouvementRoutes);
app.use("/sons",sonRoutes);


app.use("/leds",ledRoutes);
app.use("/servos",servoRoutes);
app.use("/ventilateurs",ventilateurRoutes);

app.listen(port, () => {
    try {
        console.log("the server is running !!!");
    } catch (error) {
        console.log(error);
    }
});

