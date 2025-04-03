import mongoose from "mongoose";

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const FeedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
    },
    rate: {
        type: String,
    }
}, schemaOptions);

const FeedBack = mongoose.model('FeedBack', FeedbackSchema);

export default FeedBack