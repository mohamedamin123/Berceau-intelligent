const express = require("express");
const { signUp, signIn, forgotPassword,verifyResetCode ,updatePassword} = require("../controller/authController");


const Routes = express.Router();

Routes.route("/signUp").post(signUp);
Routes.route("/signIn").post(signIn);
Routes.route("/forgot").post(forgotPassword);
Routes.route("/verifyCode").post(verifyResetCode);
Routes.route("/").patch(updatePassword);


// Export the router
module.exports = Routes;