const createReview = async (req, res) => {
  const { rating, comment, userId, nurseId } = req.body;

  const review = await Review.create({ rating, comment, userId, nurseId });

  res.status(201).json({ success: true, review });
};

module.exports = { createReview };
