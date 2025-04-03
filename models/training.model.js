import mongoose from "mongoose";

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const TrainingSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Bài tập mới'
    },
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    isInPlan: {
        type: Boolean,
        default: false
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    exercises: [
        {
            exercise: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise',
            },
            sets: [
                {
                    kilogram: {
                        type: Number,
                        min: [0, 'Phải lớn hơn hoặc bằng 0'],
                    },
                    reps: {
                        type: Number,
                        min: [1, 'Phải lớn hơn hoặc bằng 1'],
                    },
                    isCheck: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, schemaOptions);

const Training = mongoose.model('Training', TrainingSchema);

export default Training