import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from '../utils/const.js'

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
})

const postStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'posts',
    },
})

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'avatars',
    },
})

const uploadCloudPost = multer({ storage: postStorage })
const uploadCloudAvata = multer({ storage: avatarStorage })

export { uploadCloudPost, uploadCloudAvata }
