import Post from '../models/Post.js'
import User from '../models/User.js'
import { optionsPaginate } from '../utils/const.js'

export const createPost = async (req, res, next) => {
    const { email } = req.user
    const image = req.file
    const { draft } = req.body

    try {
        const user = await User.findOne({ email })
        const author = user._id
        const newPost = Post({
            ...req.body,
            author,
            imagesUrl: image.path,
        })

        await newPost.save()
        draft
            ? user.draftPosts.push(newPost._id)
            : user.queuePosts.push(newPost._id)

        await user.save()

        res.status(201).json({ newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

// GET ALL POST
export const getAllPost = async (req, res, next) => {
    const { page, limit } = req.body

    try {
        const posts = await Post.paginate(
            { public: true },
            optionsPaginate(limit, page, { populate: 'author' })
        )

        res.status(200).json({ status: 'Success', data: posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const getDetailPost = async (req, res) => {
    const { postId } = req.params
    try {
        const post = await Post.findById(postId)
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'userId',
                    model: 'User',
                },
            })
        if (!post)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Bài viết không tồn tại.',
            })
        res.status(200).json({ status: 'Success', data: post })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const updatedPostHasPublic = async (req, res) => {
    const { postId, updatedFields } = req.body
    const { email } = req.user
    try {
        const author = await User.findOne({ email })
        if (!author) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Người dùng không tồn tại.' })
        }

        const post = await Post.findById(postId)
        if (!post)
            return res
                .status(404)
                .json({ status: 'error', message: 'Bài viết không tồn tại' })
        const postIndex = author.posts.findIndex(
            (post) => post.toString() === postId
        )
        if (postIndex === -1) {
            return res.status(403).json({
                status: 'error',
                message: 'Bạn chỉ có thể chỉnh sửa bài viết của mình.',
            })
        }
        Object.keys(updatedFields).forEach((key) => {
            if (post[key] !== updatedFields[key]) {
                post[key] = updatedFields[key]
            }
        })
        const updatedPost = await post.save()
        res.status(200).json({
            status: 'success',
            message: 'Bài viết đã được cập nhật',
            data: updatedPost,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

// DELETED POST FROM DRAFT
// export const removeDraft = async (req, res) => {
//     const { postId } = req.body
//     const { email } = req.user
//     try {
//         const author = await User.findOne({ email })
//         if (!author) {
//             return res
//                 .status(404)
//                 .json({ status: 'error', message: 'Người dùng không tồn tại.' })
//         }

//         const post = await Post.findById(postId)
//         if (!post)
//             return res
//                 .status(404)
//                 .json({ status: 'error', message: 'Bài viết không tồn tại' })
//         const postIndex = author.draftPosts.findIndex(
//             (post) => post.toString() === postId
//         )
//         if (postIndex === -1) {
//             return res.status(403).json({
//                 status: 'error',
//                 message: 'Không tồn tại bài viết trong Draft.',
//             })
//         }
//         author.
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ status: 'error', message: error })
//     }
// }

// GET BY TAG
export const getPostByTagName = async (req, res) => {
    const { tagName } = req.params
    const { limit, page } = req.query
    try {
        const collections = await Post.paginate(
            { tag: tagName, public: true },
            optionsPaginate(limit, page, { populate: 'author' })
        )
        res.status(200).json({ status: 'Success', data: collections })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const getPostTrending = async (req, res) => {
    const { limit, page } = req.query
    try {
        const posts = await Post.paginate(
            { public: true },
            optionsPaginate(limit, page, {
                sort: { likes: -1 },
                populate: 'author',
            })
        )
        res.status(200).json({ status: 'Success', data: posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const toggleLikePost = async (req, res) => {
    const { postId } = req.body
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        const userId = user._id
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' })
        }

        const index = post.likes.indexOf(userId)

        if (index === -1) {
            post.likes.push(userId)
        } else {
            post.likes.splice(index, 1)
        }
        await post.save()
        res.status(200).json({
            status: 'Success',
            message: 'Thích bài viết thành công.',
            data: post,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}
