const express = require("express");
const { createBebe,updateBebe,deleteBebe,getBebe,getAllBebe } = require("../controller/bebeController");
const Routes=express.Router();

Routes.route("/").post(createBebe);
Routes.route("/:id").patch(updateBebe);
Routes.route("/:id").delete(deleteBebe);
Routes.route("/:id").get(getBebe);
Routes.route("/").get(getAllBebe);


// Export the router
module.exports=Routes;