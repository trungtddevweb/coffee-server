import mongoose from 'mongoose'

const { Schema } = mongoose

const Commnent = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        content: {
            type: String,
            required: true,
        },
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
        ],
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model('Comment', Commnent)
export default Comment
