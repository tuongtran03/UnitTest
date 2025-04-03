import multer from 'multer';
import path from 'path';
import sharp from 'sharp'
import fs from 'fs';
import { fileURLToPath } from 'url';

const maxSize = 10 * 1024 * 1024;

// import.meta.url trả về đường dẫn URL của file hiện tại
// fileURLToPath là một hàm từ module url của NodeJS, được sử dụng để chuyển đổi URL của file (dạng file://) sang đường dẫn hệ thống path
// ví dụ : file:///C:/projects/my-app/src/index.js => path: C:\projects\my-app\src\index.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage()
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Chỉ định thư mục lưu video
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
//     }
// });

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
            return cb(null, true);
        }
        cb(new Error('File type is not allowed'));
    }
}).array('files', 10);


const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size exceeds the limit of 10MB' });
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Exceeded the maximum number of files (10)' });
        }
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

const resizeImage = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    try {
        req.files = await Promise.all(
            req.files.map(async (file) => {
                const isImage = file.mimetype.startsWith('image/');
                const isVideo = file.mimetype.startsWith('video/');

                if (isImage) {
                    // Sử dụng sharp để đọc metadata
                    const image = sharp(file.buffer);
                    const metadata = await image.metadata();

                    image.rotate();

                    // Kiểm tra độ phân giải và resize nếu cần
                    if (metadata.width > 1920 || metadata.height > 1080) {
                        console.log(`Resizing image: ${file.originalname}`);

                        const resizedBuffer = await image
                            .resize({ width: 1920, height: 1080, fit: 'inside' })
                            .toBuffer();

                        // Cập nhật buffer và size sau khi resize
                        file.buffer = resizedBuffer;
                        file.size = resizedBuffer.length;
                    }
                } else if (isVideo) {
                    console.log(`Processing video: ${file.originalname}`);
                } else {
                    throw new Error(`Unsupported file type: ${file.mimetype}`);
                }

                // Tạo đường dẫn lưu file
                const filePath = path.join(__dirname, 'uploads', `${Date.now()}_${file.originalname}`);

                // Lưu file vào ổ đĩa
                fs.writeFileSync(filePath, file.buffer);

                // Cập nhật đường dẫn file
                return {
                    ...file,
                    path: filePath,
                    filename: path.basename(filePath),
                };
            })
        );

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error processing image or video file' });
    }
};

export {
    upload, handleMulterErrors, resizeImage
}
