// підключаєм фреймворки та модулі
const express = require("express")
const fs = require("fs").promises // Використовуємо проміси для кращої роботи з асинхронністю
const path = require("path")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")

dotenv.config()

const urlParser = bodyParser.urlencoded({ extended: false }) // Проміжний програмний компонент для обробки даних з форм, закодованих у форматі URL
const jsonParser = bodyParser.json() // Проміжний програмний компонент для обробки даних у форматі JSON

const port = process.env.PORT || 10000 // Визначаємо порт для сервера березмо з секретного файлу якщо не знайдено 10000
// Функція для створення шляху до HTML-сторінки
const createPath = (page) => path.resolve(__dirname, '', `${page}.html`) 

let app = express()

// Обслуговування статичних файлів з директорії 'public'
app.use('/public', express.static(path.join(__dirname, 'public')))

// Обробка GET-запиту на головну сторінку
app.get("/", async (req, res) => {
    const filePath = createPath("index") // Створюємо шлях до індексної сторінки

    try {
        await fs.access(filePath) // Перевіряємо, чи існує файл
        res.sendFile(filePath) // Відправляємо файл клієнту
    // якщо помилка
    } catch (error) {
        res.status(404).send("File not found")
        console.error(`File not found: ${filePath}`)
    }
})

// Обробка POST-запиту для додавання нового коментаря
app.post("/", urlParser, async (req, res) => {
    let result = req.body // Отримуємо дані з тіла запиту
    result['data'] = Date.now() // Додаємо поточну мітку часу
    result['likes'] = 0 // Ініціалізуємо лічильник лайків
    result['dislikes'] = 0 // Ініціалізуємо лічильник дизлайків

    try {
        let comments = await fs.readFile('public/database/coments.json', 'utf-8') // Читаємо файл з коментарями
        comments = JSON.parse(comments) // Парсимо JSON
        comments.push(result) // Додаємо новий коментар
        await fs.writeFile('public/database/coments.json', JSON.stringify(comments)) // Записуємо оновлений масив коментарів
        console.log("Comment added:", result) // Лог повідомлення про доданий коментар
        res.redirect('/') // Перенаправляємо на головну сторінку
    // якщо помилка
    } catch (error) {
        console.error('Error saving comment:', error) // Лог помилки
        res.status(500).send('Internal server error') // Відправляємо 500, якщо виникла помилка сервера
    }
})

// DELETE маршрут для видалення коментарів
app.delete('/comments/:data', urlParser, jsonParser, async (req, res) => {
    const { code: moderatorCode } = req.body // Отримуємо код модератора з тіла запиту

    // Перевіряємо код модератора
    if (moderatorCode !== process.env.MODERATOR_CODE) {
        return res.status(403).send('Недостатньо прав для видалення коментаря') // Якщо код неправильний, відправляємо 403
    }

    const dataToDelete = parseInt(req.params.data) // Перетворюємо рядок з параметра в число

    try {
        let comments = await fs.readFile('public/database/coments.json', 'utf-8') // Читаємо файл з коментарями
        comments = JSON.parse(comments) // Парсимо JSON
        comments = comments.filter(comment => comment.data !== dataToDelete) // Фільтруємо коментарі
        await fs.writeFile('public/database/coments.json', JSON.stringify(comments)) // Записуємо оновлений масив коментарів
        res.sendStatus(204) // Успішно видалено
        // якщо помилка
    } catch (error) {
        console.error('Error while deleting comment:', error)
        res.status(500).send('Внутрішня помилка сервера')
    }
})

// Запуск сервера на вказаному порту
app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`) // Лог повідомлення про запуск сервера
})