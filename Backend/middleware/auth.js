import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error verifying token" });
    }
}

export default authMiddleware;
