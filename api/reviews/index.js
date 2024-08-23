const mongoose = require('mongoose');
const { Schema } = mongoose;

// Підключення до MongoDB через рядок підключення з .env
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Створення схеми для відгуків
const reviewSchema = new Schema({
  name: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Модель для роботи з відгуками
const Review = mongoose.model('Review', reviewSchema);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Додавання нового відгуку
    const { name, comment } = req.body;
    const newReview = new Review({ name, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } else if (req.method === 'GET') {
    // Отримання всіх відгуків
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
