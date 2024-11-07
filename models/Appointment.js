const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "canceled"],
    default: "scheduled",
  },
  notes: { type: String },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
