import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token đã quá hạn sử dụng!' })
        }

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token không thích hợp!' });
    }
}

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token đã quá hạn sử dụng!' })
        }

        req.user = decoded
        if (req.user.role == 'ADMIN') {
            next()
        } else {
            return res.status(401).json({ message: 'Bạn không có quyền truy cập!' })
        }
    } catch (error) {
        return res.status(401).json({ message: 'Token không thích hợp!' });
    }
}


export {
    authenticateAdmin,
    authenticateToken
}