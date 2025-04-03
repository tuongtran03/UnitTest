import express from 'express'
import { authenticateToken } from '../middlewares/index.js'
import { getAllFoods } from '../controllers/food.controller.js'
const router = express.Router()

router.get('/getAll', authenticateToken, getAllFoods)


export default router