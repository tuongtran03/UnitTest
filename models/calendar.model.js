import mongoose from 'mongoose'

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const CalendarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    identifier: {
        type: String,
        required: true
    },
    training: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training'
    },
    planName: {
        type: String
    },
    calendarDate: {
        type: Date,
        required: true
    }
}, schemaOptions);

const Calendar = mongoose.model('Calendar', CalendarSchema);

export default Calendar