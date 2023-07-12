import mongoose from 'mongoose'

const { Schema } = mongoose

const PostSchema = new Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imagesUrl: {
            type: String,
            required: true,
            default: '',
        },
        public: {
            type: Boolean,
            default: false,
        },
        draft: {
            type: Boolean,
            default: false,
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        tag: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model('Post', PostSchema)
export default Post
