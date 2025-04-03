import express from 'express'
import { lockUser, findUserByUsernameOrEmail, getAllUsers, getUserById, getUserByEmail, updateUser, getCurrentUser, isEmailExist, updatePasswordByEmail, updateUserById } from '../controllers/user.controller.js'
import { authenticateToken, authenticateAdmin } from '../middlewares/index.js'
const router = express.Router()

router.get('/email/:email', authenticateToken, getUserByEmail)
router.put('/email/:email', updatePasswordByEmail)
router.get('/check_email/:email', isEmailExist)
router.get('/getCurrentUser', authenticateToken, getCurrentUser)
router.get('/getUserById/:id', authenticateToken, getUserById)
router.put('/:userId', authenticateToken, updateUser)
router.put('/update/updateUserById', authenticateToken, updateUserById)
router.get('/admin/getAllUsers', authenticateAdmin, getAllUsers)
router.get('/admin/findUserByUsernameOrEmail/:query', authenticateAdmin, findUserByUsernameOrEmail)
router.put('/admin/lockUser/:id', authenticateAdmin, lockUser)

export default router


