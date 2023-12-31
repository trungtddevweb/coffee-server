import dotenv from 'dotenv'

dotenv.config()

// Env
export const PORT = process.env.PORT
export const DB_URL = process.env.DB_URL
export const JWT_KEY = process.env.JWT_KEY
export const SESSION_KEY = process.env.SESSION_KEY
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
export const CLOUD_NAME = process.env.CLOUD_NAME
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET

export const optionsPaginate = (limit, page, rest = {}) => {
    return {
        limit: parseInt(limit, 10) || 10,
        page: parseInt(page, 10) || 1,
        sort: { createdAt: 'desc' },
        ...rest,
    }
}
