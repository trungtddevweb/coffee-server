import User from '../models/User.js'
import bcrypt from 'bcrypt'

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
    } catch (error) {
        res.status(500).json(error)
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
