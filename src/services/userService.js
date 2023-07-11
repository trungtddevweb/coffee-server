import { body } from 'express-validator'

export const validateSignIn = () => {
    return [
        body('email').isEmail().withMessage('Email không hợp lệ.'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có độ dài ít nhất 6 ký tự.'),
    ]
}

export const validateSignUp = () => {
    return [
        body('email').isEmail().withMessage('Email không hợp lệ.'),
        body('name')
            .isLength({ min: 1, max: 32 })
            .withMessage('Tên phải trong khoảng 1 - 32 ký tự.'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có độ dài ít nhất 6 ký tự.'),
    ]
}
