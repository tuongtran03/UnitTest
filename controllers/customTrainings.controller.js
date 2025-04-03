import mongoose from "mongoose";
import Training from "../models/training.model.js";

export const createCustomTrainings = async (req, res) => {
    try {
        const trainings = req.body;

        const createdTrainings = await Training.create(trainings);

        res.status(201).json(createdTrainings);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getByUserId = async (req, res) => {
    try {
        const userId = req.params.id
        const isCustom = req.query.isCustom
        const trainings = await Training.find({ user: userId, isCustom: isCustom ?? null })
            .populate('exercises.exercise')
            .sort({ "created_at": -1 })

        res.status(201).json(trainings);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getTrainingById = async (req, res) => {
    try {
        const trainingId = req.params.id
        const training = await Training.findById(trainingId).populate('exercises.exercise')
        res.status(201).json(training)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateTraining = async (req, res) => {
    try {
        const id = req.params.id
        const training = req.body;
        const savedTraining = await Training.findByIdAndUpdate(id, training, { new: true }).populate('exercises.exercise')
        res.status(201).json(savedTraining)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteTraining = async (req, res) => {
    try {
        const id = req.params.id
        const deletedTraining = await Training.findByIdAndDelete(id)
        res.status(201).json(deletedTraining)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}