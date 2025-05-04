const express = require("express");
const { addNotification, getNotificationsByBerceauId, getNotificationsByParentId, getAllNotifications, deleteNotificationsByParentId, deleteNotificationsByBerceauId } = require("../controller/notificationController");
const { protectionMW } = require("../middleware/protection");

const Routes = express.Router();

Routes.route("/").post(addNotification);
Routes.route("/idBerceau/:id").get(protectionMW, getNotificationsByBerceauId);
Routes.route("/idParent/:id").get(protectionMW, getNotificationsByParentId);
Routes.route("/").get(protectionMW, getAllNotifications);
Routes.route("/parent/:id").delete(protectionMW, deleteNotificationsByParentId);
Routes.route("/berceau/:id").delete(protectionMW, deleteNotificationsByBerceauId);

module.exports = Routes;
