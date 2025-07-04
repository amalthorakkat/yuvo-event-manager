const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/eventController");
const validateEvent = require("../middlewares/validateEvent");

router.post("/", validateEvent, createEvent);
router.get("/", getEvents);

module.exports = router;
