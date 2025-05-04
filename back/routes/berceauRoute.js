const express = require("express");
const { createBerceau,updateBerceau,deleteBerceau,getBerceau,getAllBerceau,findBerceauByIdParent ,findBerceauByIdBebe} = require("../controller/berceauController");
const { protectionMW } = require("../middleware/protection");
const { checkRoleMW } = require("../middleware/permission");

const Routes=express.Router();

Routes.route("/").post(protectionMW,createBerceau);
Routes.route("/:id").patch(protectionMW,updateBerceau);
Routes.route("/:id").delete(protectionMW,deleteBerceau);
Routes.route("/:id").get(getBerceau);
Routes.route("/").get(protectionMW,getAllBerceau);
Routes.route("/bebe/:id").get(protectionMW, checkRoleMW("user", "admin"),findBerceauByIdBebe);
Routes.route("/parent/:id").get(protectionMW, checkRoleMW("user", "admin"),findBerceauByIdParent);

// Export the router
module.exports=Routes;