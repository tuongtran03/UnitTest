import mongoose from "mongoose";
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
const mediaSchema = new mongoose.Schema({
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    type: { type: String, required: true }
}, schemaOptions);

const Media = mongoose.model('Media', mediaSchema);

export default Media
