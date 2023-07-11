import express from 'express'
import {
    signIn,
    signUp,
    signOut,
    googleSignIn,
    refreshToken,
} from '../controllers/auth.js'

const router = express.Router()

router.post('/sign-in', signIn)

router.post('/sign-up', signUp)

router.post('/sign-out', signOut)

router.post('/google-sign-in', googleSignIn)

router.post('/refresh-token', refreshToken)

export default router
