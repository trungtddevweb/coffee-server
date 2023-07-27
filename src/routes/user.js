import express from 'express'
import {
    getAUser,
    getAllPostSaved,
    removePostSaved,
    savePostToUser,
    updatedUser,
} from '../controllers/user.js'
import { verifyAdmin, verifyUser } from '../middlewares/verify.js'

const router = express.Router()

router.get('/find-user/:userId', verifyAdmin, getAUser)

router.get('/find/saved-post', verifyUser, getAllPostSaved)

router.post('/saved-post', verifyUser, savePostToUser)

router.post('/remove-post-saved', verifyUser, removePostSaved)

router.patch('/update-user', verifyUser, updatedUser)

export default router
