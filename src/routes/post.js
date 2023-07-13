import express from 'express'
import {
    createPost,
    getAllPost,
    getDetailPost,
    getPostByTagName,
    updatedPostHasPublic,
} from '../controllers/post.js'
import { verifyUser } from '../middlewares/verify.js'
import { uploadCloudPost } from '../middlewares/cloudinary.js'
const router = express.Router()

router.post('/create', verifyUser, uploadCloudPost.single('image'), createPost)

router.get('/all-post', getAllPost)

router.get('/:postId', getDetailPost)

router.put('/update-post-public', verifyUser, updatedPostHasPublic)

router.get('/tag/:tagName', getPostByTagName)

export default router
