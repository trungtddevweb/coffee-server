import express from 'express'
import {
    createPost,
    getAllPost,
    getDetailPost,
    getPostByTagName,
    getPostTrending,
    toggleLikePost,
    updatedPostHasPublic,
} from '../controllers/post.js'
import { verifyUser } from '../middlewares/verify.js'
import { uploadCloudPost } from '../middlewares/cloudinary.js'
const router = express.Router()

router.post('/create', verifyUser, uploadCloudPost.single('image'), createPost)

router.get('/trending', getPostTrending)

router.get('/all-post', getAllPost)

router.get('/find/:postId', getDetailPost)

router.put('/update-post-public', verifyUser, updatedPostHasPublic)

router.get('/tag/:tagName', getPostByTagName)

router.post('/toggle-like', verifyUser, toggleLikePost)

export default router
