const User = require('../models/User');
const { notifyAssignment, notifyStatusChange } = require('./notificationHelper');

/**
 * Automatically assigns the geographically closest approved/active responder
 * to the given incident.
 * 
 * @param {Object} incident - The incident mongoose document
 */
const autoAssignResponder = async (incident) => {
  try {
    // If the incident is already assigned or resolved, skip auto-assignment
    if (incident.status === 'Resolved' || incident.status === 'Assigned') {
      return;
    }

    if (!incident.location || !incident.location.coordinates || incident.location.coordinates.length < 2) {
      console.log(`⚠️ Incident ${incident._id} does not have valid coordinates for auto-assignment.`);
      return;
    }

    // Find the closest approved or active responder/authority
    const closestResponder = await User.findOne({
      role: { $in: ['Responder', 'Authority'] },
      status: { $in: ['Approved', 'Active'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: incident.location.coordinates // [longitude, latitude]
          }
        }
      }
    });

    if (!closestResponder) {
      console.log(`ℹ️ No active/approved responder found to assign to incident ${incident._id}.`);
      return;
    }

    console.log(`🎯 Auto-assigning responder "${closestResponder.name}" (${closestResponder._id}) to incident "${incident._id}"`);

    // Assign responder
    if (!incident.assignedAuthorities.includes(closestResponder._id)) {
      incident.assignedAuthorities.push(closestResponder._id);
    }

    // Transition status to Assigned
    incident.status = 'Assigned';
    incident.status_history.push({
      status: 'Assigned',
      timestamp: new Date(),
      changed_by: null // System auto-assigned
    });

    await incident.save();

    // Trigger assignment and status change notifications
    await notifyAssignment(incident);
    await notifyStatusChange(incident);

  } catch (err) {
    console.error(`❌ Error in autoAssignResponder for incident ${incident._id}:`, err.message);
  }
};

module.exports = { autoAssignResponder };
