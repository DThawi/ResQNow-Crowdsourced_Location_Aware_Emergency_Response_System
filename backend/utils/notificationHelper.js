const Notification = require('../models/Notification');

// Call this when a new incident is assigned to authorities
const notifyAssignment = async (incident) => {
  try {
    if (!incident.assignedAuthorities || incident.assignedAuthorities.length === 0) return;

    const notifications = incident.assignedAuthorities.map(authorityId => ({
      user_id: authorityId,
      title: 'New Emergency Alert',
      description: `New ${incident.type} incident reported. Tap to view details.`,
      type: 'assignment',
      incident_id: incident._id,
    }));

    await Notification.insertMany(notifications);
    console.log('✅ Assignment notifications created');
  } catch (err) {
    console.error('❌ Error creating assignment notifications:', err.message);
  }
};

// Call this when incident status changes
const notifyStatusChange = async (incident, changedBy) => {
  try {
    if (!incident.user_id) return;

    let title = '';
    let type = 'update';

    if (incident.status === 'Verified') {
      title = 'Incident Verified';
      type = 'update';
    } else if (incident.status === 'Assigned') {
      title = 'Responder Assigned';
      type = 'assignment';
    } else if (incident.status === 'Resolved') {
      title = 'Incident Resolved';
      type = 'update';
    } else {
      return;
    }

    await Notification.create({
      user_id: incident.user_id,
      title,
      description: `Your ${incident.type} incident status has been updated to ${incident.status}.`,
      type,
      incident_id: incident._id,
    });

    console.log('✅ Status change notification created');
  } catch (err) {
    console.error('❌ Error creating status notification:', err.message);
  }
};

module.exports = { notifyAssignment, notifyStatusChange };