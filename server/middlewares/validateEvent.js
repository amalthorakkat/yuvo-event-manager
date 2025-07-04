const validateEvent = (req, res, next) => {
  const { eventName, auditorium, eventType, dateTime, location } = req.body;

  if (!eventName || !auditorium || !eventType || !dateTime || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (
    !location.address ||
    !location.coordinates ||
    !location.coordinates.lat ||
    !location.coordinates.lng
  ) {
    return res
      .status(400)
      .json({ message: "Complete location details are required" });
  }

  //   validate dateTime format

  if (isNaN(Date.parse(dateTime))) {
    return res.status(400).json({ message: "Invalid dateTime format" });
  }

  next();
};

module.exports = validateEvent;
