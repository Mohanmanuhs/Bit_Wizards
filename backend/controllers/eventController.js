const Event = require("../models/Event");
const Club = require("../models/Club");
// @desc    Create event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    
    const userId = req.user._id;
    console.log(userId);
    // Find the club where userId matches
    const club = await Club.findOne({ userId });

    if (!club) {
      return res.status(400).json({ message: "Club not found for the user." });
    }
    console.log(club)
    const eventData = {
      ...req.body,
      createdBy: club._id,
      createdAt: new Date(), // Optional, Mongoose will auto-set if omitted
    };
    const event = await Event.create(eventData);
    
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all events (optionally filtered by club or type)
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.clubId) filter.createdBy = req.query.clubId;
    if (req.query.type) filter.type = req.query.type;

    const events = await Event.find(filter).populate("createdBy", "name");
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
