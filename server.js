const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")

let urlParser = bodyParser.urlencoded({ extended: false })
const port = process.env.PORT || 3000
const createPath = (page) => path.resolve(__dirname, '', `${page}.html`)

let app = express()

app.use(express.static("public"))

module.exports = app

app.get("/", (req, res) => {
    const filePath = createPath("index2")
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
        console.log(`Serving ${filePath}`)
    } else {
        res.status(404).send("File not found")
        console.error(`File not found: ${filePath}`)
    }
})

app.post("/", urlParser, (req, res) => {
    let result = req.body
    result['data'] = Date.now()

    let comments = fs.readFileSync('public/database/coments.json')
    comments = JSON.parse(comments)
    comments.push(result)
    comments = JSON.stringify(comments)
    fs.writeFileSync('public/database/coments.json', comments)

    res.redirect('/')
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})