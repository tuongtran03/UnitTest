import express from 'express'
import { createCalendarNotify, getCalendarNotifications, deleteCalendarNotifyById, deleteNotificationsPassed } from '../controllers/calendar.controller.js'
import { authenticateToken } from '../middlewares/index.js'
const router = express.Router()

router.post('/create', authenticateToken, createCalendarNotify)
router.delete('/:id', authenticateToken, deleteCalendarNotifyById)
router.delete('/delete/deleteNotificationsPassed', authenticateToken, deleteNotificationsPassed)
router.get('/getCalendars', authenticateToken, getCalendarNotifications)

export default router