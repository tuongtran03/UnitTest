import express from 'express'
import { createTrainings, getByUserId, recreateByUserId } from '../controllers/training.controller.js'
import { authenticateToken } from '../middlewares/index.js'

const router = express.Router()

router.post('/create', authenticateToken, createTrainings)
router.get('/getByUserId', authenticateToken, getByUserId)
router.post('/recreate', authenticateToken, recreateByUserId)


export default router