import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const uploadImage = (request, response) => {
    if (!request.file) {
        response.status(204)
    } else {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            })

            cloudinary.uploader.upload_stream((result) => {
                response.status(201).json({user_avatar_url: result.secure_url})
            }).end(request.file.buffer)
        } catch (error) {
            response.status(500).json({status:error})
        }
    }
}

export default uploadImage