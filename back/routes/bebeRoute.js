const express = require("express");
const { createBebe,updateBebe,deleteBebe,getBebe,getAllBebe } = require("../controller/bebeController");
const { protectionMW } = require("../middleware/protection");
const { checkRoleMW } = require("../middleware/permission");

const Routes=express.Router();

Routes.route("/").post(protectionMW,createBebe);
Routes.route("/:id").patch(protectionMW,updateBebe);
Routes.route("/:id").delete(protectionMW,deleteBebe);
Routes.route("/:id").get(protectionMW,getBebe);
Routes.route("/").get(protectionMW,getAllBebe);


// Export the router
module.exports=Routes;