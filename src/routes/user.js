import express from 'express'
import {
    getAUser,
    getAllPostSaved,
    removePostSaved,
    savePostToUser,
} from '../controllers/user.js'
import { verifyAdmin, verifyUser } from '../middlewares/verify.js'

const router = express.Router()

router.get('/find-user/:userId', verifyAdmin, getAUser)

router.get('/find/saved-post', verifyUser, getAllPostSaved)

router.post('/saved-post', verifyUser, savePostToUser)

router.post('/remove-post-saved', verifyUser, removePostSaved)

// router.use('/user')

export default router
