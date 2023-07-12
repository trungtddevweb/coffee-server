import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { JWT_KEY } from '../utils/const.js'

export const verifyAdmin = (req, res, next) => {}

export const verifyUser = async (req, res, next) => {
    if (!req.headers['authorization'])
        return res.status(401).json({
            status: 'Invalid',
            message: 'Bạn không có quyền làm điều này.',
        })
    try {
        const accessToken = req.headers['authorization'].split(' ')[1]
        const decoded = jwt.verify(accessToken, JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({
            status: 'Invalid',
            message: 'Token không hợp lệ.',
        })
    }
}
