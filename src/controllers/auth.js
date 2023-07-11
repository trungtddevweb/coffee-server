import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json('Người dùng không tồn tại.')
        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect)
            return res
                .status(400)
                .json('Tên đăng nhập hoặc mật khẩu chưa chính xác.')

        if (!user.isActive) {
            return res.status(400).json('Tài khoản của bạn đã bị khóa!')
        }
        const accessToken = jwt.sign(
            { role: user.role, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        )
        const refreshToken = jwt.sign(
            { email: user.email },
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
export const signOut = async (req, res, next) => {}

export const googleSignIn = async (req, res, next) => {
    try {
        const { idToken } = req.body

        // Gửi yêu cầu kiểm tra thông tin người dùng đến Google
        const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
        )
        const { email } = googleResponse.data

        console.log('Response: ', response)

        // Kiểm tra email trong cơ sở dữ liệu
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            // Đã tồn tại người dùng, thực hiện đăng nhập và gửi thông tin người dùng về
            // Lưu ý: Đây chỉ là ví dụ, bạn cần thay đổi phần logic này theo cấu trúc và quyền hạn của ứng dụng của mình
            res.json({ message: 'Đăng nhập thành công', user: existingUser })
        } else {
            // Người dùng chưa tồn tại, tạo mới người dùng và gửi thông tin về
            // Lưu ý: Đây chỉ là ví dụ, bạn cần thay đổi phần logic này theo cấu trúc và quyền hạn của ứng dụng của mình
            const newUser = User({})

            await newUser.save()

            res.json({
                message: 'Tạo người dùng mới thành công',
                user: newUser,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
        })
    }
}

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
                const user = User.findOne({ email, refreshToken })

                if (!user) {
                    return res
                        .status(403)
                        .json({ message: 'RefreshToken không hợp lệ' })
                }
                const accessToken = jwt.sign(
                    { email: user.email, role: user.role },
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
