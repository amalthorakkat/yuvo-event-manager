const express = require("express");
const router = express.Router();
const { createEvent } = require("../controllers/eventController");
const validateEvent = require("../middlewares/validateEvent");

router.post("/", validateEvent, createEvent);

module.exports = router;
