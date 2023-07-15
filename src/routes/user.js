import express from 'express'
import { getAUser, getsSavedPosts } from '../controllers/user.js'
import { verifyAdmin, verifyUser } from '../middlewares/verify.js'

const router = express.Router()

router.get('/find-user/:userId', verifyAdmin, getAUser)

router.use('/find/saved-post', verifyUser, getsSavedPosts)

// router.use('/user')

export default router
