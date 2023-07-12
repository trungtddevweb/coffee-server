import User from '../models/User.js'
import bcrypt from 'bcrypt'
import axios from 'axios'
import {
    generateAccessToken,
    generateRefreshToken,
} from '../services/authServices.js'

// SIGN_IN
export const signIn = async (req, res) => {
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

        const accessToken = generateAccessToken(
            user.email,
            user.role,
            user.name
        )
        const refreshToken = generateRefreshToken(
            user.email,
            user.role,
            user.name
        )

        await user.updateOne(
            { email },
            { accessToken, refreshToken },
            { new: true }
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`)
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

        const user = await User.findOne({ email })

        await user.updateOne({ accessToken: null }, { new: true })
        res.status(200).json({
            status: 'success',
            message: 'Đăng xuất thành công',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
// SIGN_IN_WITH_GOOGLE
export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body

        const googleResponse = await axios.post(
            'https://www.googleapis.com/oauth2/v3/tokeninfo',
            { id_token: idToken }
        )
        const { email, name, picture } = googleResponse.data

        const existingUser = await User.findOne({ email })
        const accessToken = existingUser
            ? generateAccessToken(
                  existingUser.email,
                  existingUser.role,
                  existingUser.name
              )
            : generateAccessToken(email, 'user', name)

        const authorizationHeader = `Bearer ${accessToken}`
        res.setHeader('Authorization', authorizationHeader)

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
    try {
        const { refreshToken } = req.body

        // Kiểm tra refreshToken có tồn tại trong cơ sở dữ liệu không
        const existingUser = await User.findOne({ refreshToken })

        if (!existingUser) {
            return res
                .status(401)
                .json({ message: 'Refresh token không hợp lệ' })
        }

        // Thực hiện quá trình refresh token để lấy access token mới
        const newAccessToken = generateAccessToken(
            existingUser.email,
            existingUser.role,
            existingUser.name
        )

        // Cập nhật access token mới vào cơ sở dữ liệu
        await existingUser.updateOne({ accessToken: newAccessToken })

        const authorizationHeader = `Bearer ${newAccessToken}`
        res.setHeader('Authorization', authorizationHeader)
        res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
        })
    }
}
