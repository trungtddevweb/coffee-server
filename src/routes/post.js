import express from 'express'
import { createPost, getAllPost } from '../controllers/post.js'
import { verifyUser } from '../middlewares/verify.js'
import { uploadCloudPost } from '../middlewares/cloudinary.js'
const router = express.Router()

router.post('/create', verifyUser, uploadCloudPost.single('image'), createPost)

router.get('/all-post', getAllPost)

// router.post('/sign-out', signOut)

export default router
