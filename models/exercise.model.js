import mongoose from 'mongoose'
import Training from './training.model.js';

const ExerciseSchema = new mongoose.Schema({
    bodyPart: {
        type: String,
        required: true
    },
    equipment: {
        type: String,
        required: true
    },
    gifUrl: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    secondaryMuscles: [
        {
            type: String
        }
    ],
    instructions: [
        {
            type: String
        }
    ],
    levels: [
        {
            type: String
        }
    ],
    purposes: [
        {
            type: String
        }
    ]
});

// Middleware: Xóa references trong Training khi Exercise bị xóa
ExerciseSchema.pre('findOneAndDelete', async function (next) {
    try {
        const exerciseId = this.getQuery()._id; // Lấy ID của Exercise đang bị xóa
        console.log("Xoa truoc khi id : ", exerciseId);

        await Training.updateMany(
            { 'exercises.exercise': exerciseId },
            { $pull: { exercises: { exercise: exerciseId } } }
        );

        next();
    } catch (error) {
        next(error);
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

export default Exercise