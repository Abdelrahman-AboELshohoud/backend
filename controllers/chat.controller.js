const Message = require("../models/Message.js");

const createMessage = async (req, res) => {
  const { content, senderId, receiverId } = req.body;
  console.log(content, senderId, receiverId);

  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ message: "Sender and receiver are required" });
  }
  if (!content) {
    return res.status(400).json({ message: "Message can't be empty" });
  }

  try {
    const message = await Message.create({ content, senderId, receiverId });
    res.status(201).json(message);
  } catch (error) {
    console.log(error, "error in createMessage");
    res.status(500).json({ message: error.message });
  }
};

const editMessage = async (req, res) => {
  const { content, messageId } = req.body;
  console.log(content, messageId);

  try {
    const message = await Message.findByIdAndUpdate(messageId, {
      content,
      isEdited: true,
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error, "error in editMessage");
    res.status(500).json({ message: error.message });
  }
};

const sendImage = async (req, res) => {
  const { image, senderId, receiverId } = req.body;

  console.log(image, senderId, receiverId);
};

const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;
  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ message: "Sender and receiver are required" });
  }
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error, "error in getMessages");
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMessage,
  editMessage,
  getMessages,
};
