import express from 'express'
import { getAllEquipments, deleteExercisesById, updateExercise, createNewExercise, getAllExercisesByBodyPart, getAllExercisesBySearchQueryName, getExerciseById, getAllBodyPart, getAllExercises } from '../controllers/exercise.controller.js'
import { authenticateToken, authenticateAdmin } from '../middlewares/index.js'
const router = express.Router()

router.get('/getAllExercisesByBodyPart/:bodyPart', authenticateToken, getAllExercisesByBodyPart)
router.get('/getAllExercisesBySearchQueryName/:searchQueryName?', authenticateToken, getAllExercisesBySearchQueryName)
router.get('/getExerciseById/:id', authenticateToken, getExerciseById)
router.get('/getAllBodyParts', getAllBodyPart)
router.get('/getAllEquipments', authenticateToken, getAllEquipments)
router.get('/getAllExercises', getAllExercises)
router.post('/admin/createNewExercise', authenticateAdmin, createNewExercise)
router.put('/admin/updateExercise', authenticateAdmin, updateExercise)
router.delete('/admin/deleteExercisesById/:id', authenticateAdmin, deleteExercisesById)

export default router