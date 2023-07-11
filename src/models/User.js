import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxLength: 32,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
        },
        avtUrl: {
            type: String,
            default: '',
        },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        postsLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        queuePosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        draftPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['admin', 'author', 'user'],
            default: 'user',
        },
        accessToken: {
            type: String,
            default: null,
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', UserSchema)
export default User
