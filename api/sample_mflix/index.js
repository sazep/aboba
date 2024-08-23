const mongoose = require('mongoose');
const { Schema } = mongoose;

// Подключение к MongoDB через строку подключения из .env
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Создание схемы для отзывов
const reviewSchema = new Schema({
  name: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
 
// Модель для работы с отзывами
const Review = mongoose.model('Review', reviewSchema);

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Добавление нового отзыва
      const { name, comment } = req.body;
      const newReview = new Review({ name, comment });
      await newReview.save();
      res.status(201).json(newReview);
    } else if (req.method === 'GET') {
      // Получение всех отзывов
      const reviews = await Review.find();
      res.status(200).json(reviews);
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
