const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Username is required"] },
  email: { type: String, unique: true, required: [true, "Email is required"] },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["patient", "nurse"],
    default: "patient",
  },
  address: {
    type: { type: String },
    coordinates: { type: [Number], default: [0, 0] },
  },
  age: { type: String },
  phoneNumber: { type: String },
  IdImageUrl: { type: String },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
userSchema.methods.comparePassword = function (password) {
  console.log("password", password);
  console.log("this.password", this.password);
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
