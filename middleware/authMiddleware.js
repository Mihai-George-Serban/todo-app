import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split('')[1];
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user;
        next();
    });
};