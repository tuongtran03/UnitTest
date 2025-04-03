import mongoose from 'mongoose'
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', _id: false },
};
const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    medias: [
        {
            $id: {
                type: String,
            },
            uri: {
                type: String
            },
            fileName: {
                type: String,
            },
            fileType: {
                type: String
            },
            fileSize: {
                type: Number
            },
            type: {
                type: String
            }
        }
    ]

}, schemaOptions)

const Message = mongoose.model('Message', messageSchema)
export default Message