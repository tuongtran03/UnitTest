import mongoose from "mongoose";
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const roomSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        trim: true,
        default: ''
    },
    roomType: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    roomImage: {
        type: String,
        default: 'https://st4.depositphotos.com/20523700/25944/i/450/depositphotos_259442610-stock-photo-illustration-leader-of-group-icon.jpg'
    },
    lastMessage: {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            default: '',
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }
}, schemaOptions);

const Room = mongoose.model('Room', roomSchema);

export default Room
