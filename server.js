const express = require("express")
const fs = require("fs").promises // Используем промисы для лучшей работы с асинхронностью
const path = require("path")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")

dotenv.config()

const urlParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json() // Middleware для парсинга JSON
const port = process.env.PORT || 3000
const createPath = (page) => path.resolve(__dirname, '', `${page}.html`)

let app = express()

// Обслуживание статических файлов из директории 'public'
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get("/", async (req, res) => {
    const filePath = createPath("index")

    try {
        await fs.access(filePath) // Проверяем, существует ли файл
        res.sendFile(filePath)
        console.log(`Serving ${filePath}`)
    } catch (error) {
        res.status(404).send("File not found")
        console.error(`File not found: ${filePath}`)
    }
})

app.post("/", urlParser, async (req, res) => {
    let result = req.body
    result['data'] = Date.now() // Добавляем текущую метку времени
    result['likes'] = 0
    result['dislikes'] = 0

    try {
        let comments = await fs.readFile('public/database/coments.json', 'utf-8')
        comments = JSON.parse(comments)
        comments.push(result)
        await fs.writeFile('public/database/coments.json', JSON.stringify(comments))
        console.log("Comment added:", result)
        res.redirect('/')
    } catch (error) {
        console.error('Error saving comment:', error)
        res.status(500).send('Internal server error')
    }
})

// DELETE маршрут для удаления комментариев
app.delete('/comments/:data', urlParser, jsonParser, async (req, res) => {
    const { code: moderatorCode } = req.body // Получаем код модератора из тела запроса

    // Проверяем код модератора
    if (moderatorCode !== process.env.MODERATOR_CODE) {
        return res.status(403).send('Недостаточно прав для удаления комментария')
    }

    const dataToDelete = parseInt(req.params.data) // Преобразуем строку в число

    try {
        let comments = await fs.readFile('public/database/coments.json', 'utf-8')
        comments = JSON.parse(comments)
        comments = comments.filter(comment => comment.data !== dataToDelete) // Фильтруем комментарии
        await fs.writeFile('public/database/coments.json', JSON.stringify(comments))
        res.sendStatus(204) // Успешно удалено
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error)
        res.status(500).send('Внутренняя ошибка сервера')
    }
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})