const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware CORS
app.use(cors());

// Importez vos routes comme d'habitude
const userRoutes = require("./routes/userRoute");
const bebeRoutes = require("./routes/bebeRoute");
const berceauRoutes = require("./routes/berceauRoute");
const notificationRoutes = require("./routes/notificationRoute");
const authRoutes = require("./routes/authRoute");
const dhtRoutes = require("./routes/capteurs/DHTRoute");
const mouvementRoutes = require("./routes/capteurs/mouvementRoute");
const sonRoutes = require("./routes/capteurs/sonRoute");
const ledRoutes = require("./routes/actionnaires/ledRoute");
const servoRoutes = require("./routes/actionnaires/servoRoute");
const ventilateurRoutes = require("./routes/actionnaires/ventilateurRoute");

// Utilisation des routes
app.use("/users", userRoutes);
app.use("/bebes", bebeRoutes);
app.use("/berceaux", berceauRoutes);
app.use("/notifications", notificationRoutes);
app.use("/auths", authRoutes);
app.use("/dhts", dhtRoutes);
app.use("/mouvements", mouvementRoutes);
app.use("/sons", sonRoutes);
app.use("/leds", ledRoutes);
app.use("/servos", servoRoutes);
app.use("/ventilateurs", ventilateurRoutes);

// Définir votre fonction Firebase pour l'API Express
exports.api = functions.https.onRequest(app);
