import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: {
        type: String
    },
    Calories: {
        type: Number,
    },
    Protein: {
        type: Number
    },
    Fat: {
        type: Number,
    },
    Carbonhydrates: {
        type: Number,
    },
    Weight: {
        type: Number
    }
});

const Food = mongoose.model('Food', FoodSchema);

export default Food