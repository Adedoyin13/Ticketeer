const asyncHandler = require("express-async-handler");
const Review = require("../Model/reviewModel");
const Event = require("../Model/eventModel");

const addReview = asyncHandler(async () => {
  try {
    const { rating, comment } = req.body;
    let errors = [];
    const userId = req.userId; // Ensure this is coming from authentication middleware
    const { eventId } = req.params;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    } else if (!rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.push({ msg: "Rating must be between 1 and 5" });
    } else if (!comment || comment.length < 5) {
      errors.push({ msg: "Comment must be at least 5 characters long" });
    } else if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const review = new Review({
      event: eventId,
      user: userId,
      rating,
      comment,
    });

    await review.save();
    return res.status(201).json(review);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
});

const getReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate(
      "user",
      "photo"
    );
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});

const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("event", "title") // Populate event title
      .populate("user", "photo"); // Populate user details

    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Update event's average rating
    const reviews = await Review.find({ event: review.event });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
        : 0;

    await Event.findByIdAndUpdate(review.event, { averageRating });

    return res.json({ message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { addReview, getReviews, getAllReviews, deleteReview };