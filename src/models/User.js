import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

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
        postsSaved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        queuePosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        draftPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
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
        googleLogin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', UserSchema)
export default User
