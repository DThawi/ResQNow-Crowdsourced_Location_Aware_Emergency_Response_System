const User = require('../models/User');
const Incident = require('../models/Incident');
const { autoAssignResponder } = require('../utils/autoAssignment');

// Mock notification utilities to prevent sending actual notifications or database writes
jest.mock('../utils/notificationHelper', () => ({
  notifyAssignment: jest.fn().mockResolvedValue(true),
  notifyStatusChange: jest.fn().mockResolvedValue(true),
}));

describe('Automated Responder Assignment Tests (Mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should assign the geographically closest approved/active responder', async () => {
    const mockResponder = {
      _id: 'responder123',
      name: 'Close Responder',
      email: 'close@resqnow.com',
      role: 'Responder',
      status: 'Approved'
    };

    // Mock User.findOne to return the mockResponder
    jest.spyOn(User, 'findOne').mockResolvedValue(mockResponder);

    // Create a mock incident document
    const mockIncident = {
      _id: 'incident123',
      type: 'Fire',
      description: 'Test Incident',
      location: {
        type: 'Point',
        coordinates: [79.8590, 6.9310]
      },
      status: 'Pending',
      assignedAuthorities: [],
      status_history: [],
      save: jest.fn().mockImplementation(function() {
        return Promise.resolve(this);
      })
    };

    // Run auto-assignment
    await autoAssignResponder(mockIncident);

    // Verify User.findOne was called with correct parameters
    expect(User.findOne).toHaveBeenCalledWith({
      role: { $in: ['Responder', 'Authority'] },
      status: { $in: ['Approved', 'Active'] },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [79.8590, 6.9310]
          }
        }
      }
    });

    // Verify incident properties were updated correctly
    expect(mockIncident.status).toBe('Assigned');
    expect(mockIncident.assignedAuthorities).toContain('responder123');
    expect(mockIncident.status_history.length).toBe(1);
    expect(mockIncident.status_history[0].status).toBe('Assigned');
    expect(mockIncident.save).toHaveBeenCalled();
  });

  test('Should skip assignment if incident is already Assigned', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const mockIncident = {
      _id: 'incident123',
      status: 'Assigned',
      location: {
        type: 'Point',
        coordinates: [79.8590, 6.9310]
      },
      assignedAuthorities: ['responder123'],
      status_history: [],
      save: jest.fn()
    };

    await autoAssignResponder(mockIncident);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(mockIncident.save).not.toHaveBeenCalled();
  });
});
