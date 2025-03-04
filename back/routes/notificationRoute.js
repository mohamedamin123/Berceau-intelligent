const express = require("express");
const { addNotification, getNotificationsByBerceauId, getNotificationsByParentId, getAllNotifications } = require("../controller/notificationController");
const { protectionMW } = require("../middleware/protection");
const Routes=express.Router();

Routes.route("/").post(protectionMW,addNotification);
Routes.route("/idBerceau/:id").get(protectionMW,getNotificationsByBerceauId);
Routes.route("/idParent/:id").get(protectionMW,getNotificationsByParentId);
Routes.route("/").get(protectionMW,getAllNotifications);


// Export the router
module.exports=Routes;