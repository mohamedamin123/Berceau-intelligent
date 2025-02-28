const express = require("express");
const { addNotification, getNotificationsByBerceauId, getNotificationsByParentId, getAllNotifications } = require("../controller/notificationController");
const Routes=express.Router();

Routes.route("/").post(addNotification);
Routes.route("/idBerceau/:id").get(getNotificationsByBerceauId);
Routes.route("/idParent/:id").get(getNotificationsByParentId);
Routes.route("/").get(getAllNotifications);


// Export the router
module.exports=Routes;