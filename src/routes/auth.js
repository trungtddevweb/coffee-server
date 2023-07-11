import express from 'express'
import { signIn, signUp, signOut, googleSignIn } from '../controllers/auth.js'
import { validateSignIn } from '../services/userService.js'
import validate from '../utils/validate.js'

const router = express.Router()

router.post('/sign-in', validateSignIn(), validate, signIn)

router.post('/sign-up', signUp)

router.post('/sign-out', signOut)

router.post('/google-sign-in', googleSignIn)

export default router
