import express from 'express'
import { createTrainingRecord, getTrainingRecord, getTrainingsByMonth, getAllTrainingRecordByUserId, getTrainingsByWeek } from '../controllers/trainingRecord.controller.js'
import { authenticateToken } from '../middlewares/index.js'

const router = express.Router()
router.post('/create', authenticateToken, createTrainingRecord)
router.get('/getDetail/:id', authenticateToken, getTrainingRecord)
router.get('/getTrainingByWeek', authenticateToken, getTrainingsByWeek)
router.get('/getTrainingsByMonth/:month', authenticateToken, getTrainingsByMonth)
router.get('/getAllTrainingRecords', authenticateToken, getAllTrainingRecordByUserId)

export default router