const Appointment = require("../models/Appointment");
const User = require("../models/User");

const createAppointment = async (req, res) => {
  try {
    const { patientId, nurseId, date, time, notes } = req.body;

    // Check if patient and nurse exist
    const patient = await User.findById(patientId);
    const nurse = await User.findById(nurseId);

    if (!patient || patient.role !== "patient") {
      return res
        .status(404)
        .json({ error: "Patient not found or invalid role" });
    }

    if (!nurse || nurse.role !== "nurse") {
      return res.status(404).json({ error: "Nurse not found or invalid role" });
    }

    const appointment = new Appointment({
      patient: patientId,
      nurse: nurseId,
      date,
      time,
      notes,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments for a specific user (patient or nurse)
const getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { nurse: userId }],
    }).populate("patient nurse", "name role"); // Populate patient and nurse info

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark an appointment as completed
const completeAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = "canceled";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  completeAppointment,
  cancelAppointment,
};
