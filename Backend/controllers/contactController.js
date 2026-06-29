// controllers/contactController.js
const ContactMessage = require('../models/contactMessage');

// POST /contact  (public — anyone can submit)
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newMessage = await ContactMessage.create({ name, email, message });

    return res.status(201).json({
      message: 'Message submitted successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /contact  (admin only — view all messages)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /contact/:id  (admin only — update status, e.g. mark as Read/Resolved)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({ message: 'Status updated', data: updated });
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /contact/:id  (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};