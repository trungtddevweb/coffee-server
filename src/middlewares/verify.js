import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyAdmin = (req, res, next) => {}

export const verifyUser = async (req, res, next) => {
    if (req.cookies?.jwt) {
        const accessToken = req.cookies.jwt
        jwt.verify(accessToken, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                return res
                    .status(403)
                    .json({ message: 'Access_Token không hợp lệ' })
            } else {
                req.user = decoded
                next()
            }
        })
    } else {
        return res.status(401).json({ message: 'Không tìm thấy refreshToken' })
    }
}
