import mongoose from 'mongoose'
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', _id: false },
};
const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    current: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
    },
    trainings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Training',
        }
    ],
    image: {
        type: String
    }

}, schemaOptions)

const Plan = mongoose.model('Plan', planSchema)
export default Plan