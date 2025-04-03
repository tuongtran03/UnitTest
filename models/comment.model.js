import mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, schemaOptions);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment