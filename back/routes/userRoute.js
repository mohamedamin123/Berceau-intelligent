const express = require("express");
const { createUser, signUp, updateUser, deleteUser, getUser, getAllUser, signIn } = require("../controller/userController");
const { protectionMW } = require("../middleware/protection");
const { checkRoleMW } = require("../middleware/permission");

const Routes = express.Router();

Routes.route("/").post(protectionMW,checkRoleMW("admin"),createUser);
Routes.route("/:id").patch(protectionMW,checkRoleMW( "user","admin"), updateUser);
Routes.route("/:id").delete(protectionMW,checkRoleMW( "admin"), deleteUser);
Routes.route("/:id").get(protectionMW,checkRoleMW( "user","admin"), getUser);
Routes.route("/").get(protectionMW,checkRoleMW("admin"), getAllUser);


// Export the router
module.exports = Routes;