import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import { PORT } from './src/utils/const.js'
import appRoutes from './src/routes/index.js'
import connectDB from './connect.js'

const app = express()

// Middlewawre
app.use(express.json())
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'https://coffee-sweet.vercel.app',
    ]
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PATCH, PUT'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(helmet())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/api', appRoutes)

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
