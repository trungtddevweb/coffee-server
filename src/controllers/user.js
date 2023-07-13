import User from '../models/User.js'
import { optionsPaginate } from '../utils/const.js'

// GET A USER
export const getAUser = async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId)
        if (!user)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Không tìm thấy người dùng.',
            })
        res.status(200).json({ status: 'Success', data: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    const { limit, page } = req.body
    try {
        const users = await User.paginate({}, optionsPaginate(limit, page))
        res.status(200).json({ status: 'Success', data: users })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}
