const express = require("express");
const {
  createAppointment,
  getAppointmentsByUser,
  completeAppointment,
  cancelAppointment,
} = require("../controllers/appointment.controller.js");
const { verifyToken } = require("../middlewares/verifications");
const router = express.Router();

router.post("/", verifyToken, createAppointment);

router.get("/:userId", verifyToken, getAppointmentsByUser);

router.put("/:id/complete", verifyToken, completeAppointment);

router.put("/:id/cancel", verifyToken, cancelAppointment);

module.exports = router;
