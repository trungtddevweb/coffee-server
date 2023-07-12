import Post from '../models/Post.js'
import User from '../models/User.js'

export const createPost = async (req, res, next) => {
    const { email } = req.user
    const image = req.file

    try {
        const user = await User.findOne({ email })
        const author = user._id
        const newPost = Post({
            ...req.body,
            author,
            imagesUrl: image.path,
        })
        await newPost.save()

        res.status(201).json({ newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// GET ALL POST
export const getAllPost = async (req, res, next) => {
    try {
        const posts = await Post.find({ public: true })
        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
