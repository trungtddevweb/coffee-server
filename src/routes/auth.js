import express from 'express'
import {
    signIn,
    signUp,
    signOut,
    googleSignIn,
    refreshToken,
} from '../controllers/auth.js'
import { verifyUser } from '../middlewares/verify.js'

const router = express.Router()

router.post('/sign-in', signIn)

router.post('/sign-up', signUp)

router.post('/sign-out', verifyUser, signOut)

router.post('/google-sign-in', googleSignIn)

router.post('/refresh-token', refreshToken)

export default router
