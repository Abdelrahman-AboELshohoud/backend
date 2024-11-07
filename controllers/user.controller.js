const User = require("../models/User");

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error, "error in deleteUser");
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { ...data } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error, "error in updateUser");
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { deleteUser, updateUser };
