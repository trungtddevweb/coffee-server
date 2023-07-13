import express from 'express'
import { getAUser } from '../controllers/user.js'
import { verifyAdmin } from '../middlewares/verify.js'

const router = express.Router()

router.get('/find-user/:userId', verifyAdmin, getAUser)

// router.use('/post')

// router.use('/user')

export default router
