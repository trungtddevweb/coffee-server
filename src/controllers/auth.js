import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import axios from 'axios'

// SIGN_IN
export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json('Người dùng không tồn tại.')
        if (user.googleLogin) {
            return res.status(400).json('Tài khoản đã liên kết với google.')
        }
        if (!user.isActive) {
            return res.status(400).json('Tài khoản của bạn đã bị khóa!')
        }

        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect)
            return res
                .status(400)
                .json('Tên đăng nhập hoặc mật khẩu chưa chính xác.')

        const accessToken = jwt.sign(
            { role: user.role, email: user.email, name: user.name },
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        )
        const refreshToken = jwt.sign(
            { email: user.email, role: user.role, name: user.name },
            process.env.JWT_KEY,
            { expiresIn: '365d' }
        )
        user.accessToken = accessToken
        user.refreshToken = refreshToken

        await User.findOneAndUpdate(
            { email },
            { accessToken, refreshToken },
            { new: true }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({ accessToken })
    } catch (error) {
        console.log('error', error)
        return res.status(500).json(error)
    }
}
// SIGN_UP
export const signUp = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) return res.status(400).json('Email đã được sử dụng!')
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)
        const newUser = User({
            ...req.body,
            password: hashPass,
        })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

// SIGN_OUT
export const signOut = async (req, res, next) => {
    try {
        const { email } = req.user
        console.log('email', email)

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json('Không tìm thấy người dùng.')

        await user.updateOne({ accessToken: null }, { new: true })

        res.clearCookie('jwt').status(200).json('Đăng xuất thành công.')
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
// SIGN_IN_WITH_GOOGLE
export const googleSignIn = async (req, res, next) => {
    try {
        const { idToken } = req.body

        const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
        )
        const { email, name, picture } = googleResponse.data

        const existingUser = await User.findOne({ email })
        const accessToken = jwt.sign(
            {
                role: existingUser ? existingUser.role : 'user',
                email: existingUser ? existingUser.email : email,
                name: existingUser ? existingUser.name : name,
            },
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        )
        res.cookie('jwt', accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })

        if (existingUser) {
            await existingUser.updateOne({ accessToken }, { new: true })
            res.status(200).json({ accessToken })
        } else {
            const newUser = User({
                name,
                email,
                refreshToken: idToken,
                accessToken,
                avtUrl: picture,
                googleLogin: true,
            })

            await newUser.save()
            res.status(200).json({ accessToken })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
        })
    }
}

// REFRESH_TOKEN
export const refreshToken = async (req, res, next) => {
    if (req.cookies?.jwt) {
        // Destructuring refreshToken from cookie
        const refreshToken = req.cookies.jwt

        // Verifying refresh token
        jwt.verify(refreshToken, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                // Wrong Refesh Token
                return res
                    .status(403)
                    .json({ message: 'RefreshToken không hợp lệ' })
            } else {
                // Correct token we send a new access token
                const { email } = decoded
                const user = await User.findOne({ email, refreshToken })

                if (!user) {
                    return res
                        .status(403)
                        .json({ message: 'RefreshToken không hợp lệ' })
                }
                const accessToken = jwt.sign(
                    { email: user.email, role: user.role, name: user.name },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1d',
                    }
                )
                user.accessToken = accessToken

                await User.findOneAndUpdate(
                    { email },
                    { accessToken },
                    { new: true }
                )
                return res.status(200).json({ accessToken })
            }
        })
    } else {
        return res.status(401).json({ message: 'Không tìm thấy refreshToken' })
    }
}
