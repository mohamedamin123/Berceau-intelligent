const express = require("express");
const { createUser,signUp,updateUser,deleteUser,getUser,getAllUser,signIn } = require("../controller/userController");
const Routes=express.Router();

Routes.route("/").post(createUser);
Routes.route("/signup").post(signUp);

Routes.route("/:id").patch(updateUser);
Routes.route("/:id").delete(deleteUser);
Routes.route("/:id").get(getUser);
Routes.route("/").get(getAllUser);
Routes.route("/signIn").post(signIn);


// Export the router
module.exports=Routes;