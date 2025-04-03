import express from 'express'
import { createCustomTrainings, getByUserId, getTrainingById, updateTraining, deleteTraining } from '../controllers/customTrainings.controller.js'

const router = express.Router()

router.post('/create', createCustomTrainings)
router.get('/getByUserId/:id', getByUserId)
router.get('/:id', getTrainingById)
router.put('/:id/update', updateTraining)
router.delete('/:id/delete', deleteTraining)

export default router