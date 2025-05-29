const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const listing = await Listing.findById(listingId);
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * days;

    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    await booking.save();
    res.redirect("/bookings/my-bookings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating booking");
  }
};

module.exports.getUserBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  
    const formattedBookings = bookings.map((booking) => {
      const checkInFormatted = booking.checkIn.toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' });
      const checkOutFormatted = booking.checkOut.toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric' });
  
      return {
        ...booking.toObject(),
        checkInFormatted,
        checkOutFormatted,
      };
    });
  
    res.render("bookings/myBookings", { bookings: formattedBookings });
  };
  

module.exports.cancelBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.redirect("/bookings/my-bookings");
};
