import Post from '../models/Post.js'
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

// POST
export const getsSavedPosts = async (req, res) => {
    const { limit, page } = req.query
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not found',
                message: 'Không tìm thấy người dùng.',
            })

        const savedPosts = user.postsLiked // Lầ 1 mảng chứa các _id của posts
        const posts = await Post.paginate(
            { _id: { $in: savedPosts } },
            optionsPaginate(limit, page)
        )
        res.status(200).json({
            status: 'Success',
            data: posts,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}
