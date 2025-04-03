import mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const BlogSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    ],
    likes: {
        type: [String],
        default: []
    },
    comments: [
        {
            type: Object,
        }
    ],
    allowComment: {
        type: Boolean,
        default: true
    }
}, schemaOptions);

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog