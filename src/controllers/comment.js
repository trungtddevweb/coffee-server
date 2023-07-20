import Comment from '../models/Comment.js'
import User from '../models/User.js'
import Post from '../models/Post.js'

export const createNewComment = async (req, res) => {
    const { email } = req.user
    const { content, postId } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Người dùng không tồn tại.',
            })
        const post = await Post.findById(postId)
        if (!post)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Bài viết không tồn tại.',
            })
        const newComment = Comment({
            content,
            postId,
            userId: user._id,
        })
        await newComment.save()

        post.comments.push({
            userId: newComment.userId,
            commentId: newComment._id,
            content: newComment.content,
            likes: newComment.likes,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt,
        })
        await post.save()

        res.status(201).json({
            status: 'Success',
            message: 'Tạo mới comment thành công!',
            data: newComment,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const updateComment = async (req, res) => {
    const { commentId, content } = req.body
    const { email } = req.user
    try {
        const comment = await Comment.findById(commentId)
        if (!comment)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Bình luận không tồn tại.',
            })
        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({
                status: 'Not Found',
                message: 'Người dùng không tồn tại.',
            })
        if (comment.userId !== user._id)
            return res.status(403).json({
                status: 'Forbidden',
                message: 'Bạn không có quyền làm điều này.',
            })

        comment.content = content
        const updatedComment = await comment.save()

        res.status(200).json({
            status: 'Success',
            message: 'Cập nhật bình luận thành công.',
            data: updatedComment,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}
