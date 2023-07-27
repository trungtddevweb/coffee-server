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
export const getAllPostSaved = async (req, res) => {
    const { limit, page } = req.query
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not found',
                message: 'Không tìm thấy người dùng.',
            })

        const savedPosts = user.postsSaved
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

export const savePostToUser = async (req, res) => {
    const { email } = req.user
    const { postId } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Không tìm thấy người dùng.',
            })
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' })
        }

        const index = user.postsSaved.indexOf(postId)

        if (index === -1) {
            user.postsSaved.push(postId)
        } else {
            return res.status(400).json({
                status: 'Error',
                message: 'Bài viết đã có trong mục đã lưu.',
            })
        }

        await user.save()

        res.status(200).json({
            status: 'Success',
            message: 'Lưu bài viết thành công.',
            data: user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const removePostSaved = async (req, res) => {
    const { postId } = req.body
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Không tìm thấy người dùng.',
            })
        const indexPost = user.postsSaved.indexOf(postId)
        if (indexPost === -1) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Bài viết không tồn tại trong mục đã lưu của bạn.',
            })
        } else {
            user.postsSaved.splice(indexPost, 1)
        }
        await user.save()

        res.status(200).json({ status: 'Success', data: user.postsSaved })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const updatedUser = async (req, res) => {
    const { email } = req.user
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { ...req.body },
            {
                new: true,
            }
        )

        if (!user) {
            // Nếu không tìm thấy người dùng, trả về thông báo lỗi
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy người dùng với email đã cung cấp.',
            })
        }

        return res.status(200).json({
            status: 200,
            message: 'Cập nhập thông tin người dùng thành công.',
            data: user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error,
        })
    }
}
