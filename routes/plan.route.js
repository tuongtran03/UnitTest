import express from 'express'
import { authenticateToken } from '../middlewares/index.js'
import { createPlans, getAllPlansByUserId, updateCurrentPlanById, recreatePlans } from '../controllers/plan.controller.js'
const router = express.Router()

router.get('/getAllPlansByUserId', authenticateToken, getAllPlansByUserId)
router.post('/createPlans', authenticateToken, createPlans)
router.post('/recreate', authenticateToken, recreatePlans)
router.put('/updateCurrentPlanById/:planId', authenticateToken, updateCurrentPlanById)

export default router