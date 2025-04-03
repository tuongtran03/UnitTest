import mongoose from 'mongoose'

const TrainingRecordSchema = new mongoose.Schema({
    training: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caloriesBurned: {
        type: Number
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})


const TrainingRecord = mongoose.model('TrainingRecord', TrainingRecordSchema);

export default TrainingRecord