// иза этой строки я убил 2 дня и около 12 часов времени
require('dotenv').config({ path: '../.env' })
// импортирую библиотеку и переношу в переменую
const mongoose = require('mongoose')

// проверка подключения к базе
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  // как я понял 2 строки снизу улучшают производительность
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // родной js спасибо что ты рядом
}).then(() => {
  console.log("Успешно подключились к MongoDB")
}).catch((err) => {
  console.error("Ошибка подключения к MongoDB:", err)
})

// разбиает на нужные части чтоб не надо было mongoose.Schema.name и тд
const { Schema } = mongoose

// Создание схемы для отзывов название коментарий дата
const reviewSchema = new Schema({
  name: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
})

// шаблон для работы с отзывами
const Review = mongoose.model('Review', reviewSchema)

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Добавление нового отзыва  
    const { name, comment } = req.body// получаем данные
    const newReview = new Review({ name, comment }) // создаем с помощу нашего шаблона
    await newReview.save() // сохраняем
    res.status(201).json(newReview) // отправляем отзыв и статус 201 (почему так я не совсем понял)
  } else if (req.method === 'GET') {
    // Получение всех отзывов
    const reviews = await Review.find() //получаем все отзывы
    res.status(200).json(reviews) // снова ответ
  } else {
    res.status(405).end() // есле вдруг не сработает (не будут подерживатся данные(мы накосячим крч))
  }
}
// вобще я думал не добавлять статусы но пишут что лучше добавлять тк это более понятно клиенту есле что(ага да раскажите) ну и 
// самим разработчикам (логично)