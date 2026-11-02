// import express
const express = require('express')

// import cors
const cors = require('cors')

const bodyParser = require('body-parser')

const router = require('./routes')

// init app
const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// define port
const port = 3000

// route
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})