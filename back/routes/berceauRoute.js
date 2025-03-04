const express = require("express");
const { createBerceau,updateBerceau,deleteBerceau,getBerceau,getAllBerceau } = require("../controller/berceauController");
const { protectionMW } = require("../middleware/protection");
const Routes=express.Router();

Routes.route("/").post(protectionMW,createBerceau);
Routes.route("/:id").patch(protectionMW,updateBerceau);
Routes.route("/:id").delete(protectionMW,deleteBerceau);
Routes.route("/:id").get(protectionMW,getBerceau);
Routes.route("/").get(protectionMW,getAllBerceau);


// Export the router
module.exports=Routes;