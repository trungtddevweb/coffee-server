import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../utils/const.js'

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
        return res.status(400).json({
            name: error.name,
            message: error.message,
        })
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {
        verifyUser(req, res, () => {
            if (req.user && req.user.role === 'admin') {
                next() // Cho phép tiếp tục middleware tiếp theo
            } else {
                res.status(401).json({
                    status: 'Unauthorized',
                    message: 'Bạn không có quyền làm điều này.',
                })
            }
        })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error })
    }
}
