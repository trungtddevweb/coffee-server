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
app.use(
    cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
    })
)
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
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
