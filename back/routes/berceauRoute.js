const express = require("express");
const { createBerceau,updateBerceau,deleteBerceau,getBerceau,getAllBerceau } = require("../controller/berceauController");
const Routes=express.Router();

Routes.route("/").post(createBerceau);
Routes.route("/:id").patch(updateBerceau);
Routes.route("/:id").delete(deleteBerceau);
Routes.route("/:id").get(getBerceau);
Routes.route("/").get(getAllBerceau);


// Export the router
module.exports=Routes;