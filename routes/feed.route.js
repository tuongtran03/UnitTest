import express from 'express'
import { deleteById, createFeed, uploadMedia, getAllBlogs, getBlogById, updateBlogById, getFeedsByUserId } from '../controllers/feed.controller.js'
import { authenticateToken } from '../middlewares/index.js'
import { upload, handleMulterErrors, resizeImage } from '../multerConfig.js'
const router = express.Router()

router.post(
    '/uploads',
    authenticateToken,
    (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return handleMulterErrors(err, req, res, next);
            }
            next();
        });
    },
    resizeImage,
    uploadMedia
)

router.post(
    '/create',
    authenticateToken,
    createFeed
)
router.get('/getDetail/:id', authenticateToken, getBlogById)
router.get('/user/:id', authenticateToken, getFeedsByUserId)
router.get('/getAll', authenticateToken, getAllBlogs)
router.delete('/deleteById/:id', authenticateToken, deleteById)
router.put('/update/:id', authenticateToken, updateBlogById)
export default router