const express = require("express");
const { createBebe,updateBebe,deleteBebe,getBebe,getAllBebe ,findBebesByIdParent ,findBebeByIdBerceau, deleteAllBebeByBerceauId} = require("../controller/bebeController");
const { protectionMW } = require("../middleware/protection");
const { checkRoleMW } = require("../middleware/permission");

const Routes=express.Router();

Routes.route("/").post(protectionMW, checkRoleMW("user", "admin"),createBebe);
Routes.route("/:id").patch(protectionMW, checkRoleMW("user", "admin"),updateBebe);
Routes.route("/:id").delete(protectionMW, checkRoleMW("user", "admin"),deleteBebe);
Routes.route("/:id").get(protectionMW, checkRoleMW("user", "admin"),getBebe);
Routes.route("/").get(protectionMW, checkRoleMW("user", "admin"),getAllBebe);
Routes.route("/parent/:parentId").get(protectionMW, checkRoleMW("user", "admin"),findBebesByIdParent);
Routes.route("/berceau/:id").get(protectionMW, checkRoleMW("user", "admin"),findBebeByIdBerceau);
Routes.route("/berceau/:id").delete(protectionMW, checkRoleMW("user", "admin"),deleteAllBebeByBerceauId);


// Export the router
module.exports=Routes;