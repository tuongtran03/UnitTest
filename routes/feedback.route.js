import express from 'express'
import { authenticateAdmin } from '../middlewares/index.js'
import { deleteById, getAllFeedbacks, createFeedBack } from '../controllers/feedBack.controller.js'
const router = express.Router()

router.post('/create', createFeedBack)
router.get('/admin/getAllFeedbacks/', authenticateAdmin, getAllFeedbacks)
router.delete('/admin/deleteById/:id', authenticateAdmin, deleteById)


export default router