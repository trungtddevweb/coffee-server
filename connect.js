import mongoose from 'mongoose'
import { DB_URL } from './src/utils/const.js'

mongoose.set('strictQuery', false)

const connectDB = async () => {
    const url = DB_URL
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log({
            status: 'success',
            message: 'MongDB has been successfully connected!!!',
        })
    } catch (err) {
        console.error({ message: err.message })
    }
}

export default connectDB
