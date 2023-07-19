import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
)

Commnent.plugin(mongoosePaginate)

const Comment = mongoose.model('Comment', Commnent)
export default Comment
