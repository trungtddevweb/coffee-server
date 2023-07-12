import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../utils/const.js'

export const generateAccessToken = (email, role, name) => {
    const payload = {
        email,
        role,
        name,
    }
    const accessToken = jwt.sign(payload, JWT_KEY, {
        expiresIn: '1d',
    })
    return accessToken
}

export const generateRefreshToken = (email, role, name) => {
    const payload = {
        email,
        role,
        name,
    }
    const refreshToken = jwt.sign(payload, JWT_KEY, {
        expiresIn: '1y',
    })
    return refreshToken
}
