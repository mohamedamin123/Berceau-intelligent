const express = require("express");
const { signUp, signIn } = require("../controller/authController");


const Routes = express.Router();

Routes.route("/signup").post(signUp);
Routes.route("/signIn").post(signIn);


// Export the router
module.exports = Routes;