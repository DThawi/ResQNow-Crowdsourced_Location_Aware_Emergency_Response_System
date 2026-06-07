const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all notifications for logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// PATCH mark single notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

// PATCH mark all notifications as read
router.patch('/read/all', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user.id }, { is_read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
});

module.exports = router;