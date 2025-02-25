//Imporatation 
const express = require("express");
const port = 9000;
const userRoutes=require("./routes/userRoute")



//creation instance de objet express
const app = express();

//utiliser format JSON
app.use(express.json());
//Les routes
app.use("/users",userRoutes);



app.listen(port, () => {
    try {
        console.log("the server is running !!!");
    } catch (error) {
        console.log(error);
    }
});

