import express from 'express'
import { login, signup, logout } from '../controllers/auth.controller.js'
import { authenticateToken } from '../middlewares/index.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', authenticateToken, logout)

export default router