import express from 'express'
import userRoutes from './user.js'
import postRoutes from './post.js'
import authRoutes from './auth.js'
import commentRoutes from './comment.js'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/user', userRoutes)

router.use('/post', postRoutes)

router.use('/comment', commentRoutes)

export default router
