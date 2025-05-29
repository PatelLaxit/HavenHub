const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");

router.post("/create", isLoggedIn, bookingController.createBooking);
router.get("/my-bookings", isLoggedIn, bookingController.getUserBookings);
router.post("/cancel/:id", isLoggedIn, bookingController.cancelBooking);

module.exports = router;
