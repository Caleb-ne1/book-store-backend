const { sign, verify } = require("jsonwebtoken");

const generateToken =  (user) => {
    const accessToken = sign({email: user.email, userId: user.id}, "hellocaleb");
    return accessToken;
}


const validateToken = (req, res, next) => {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const validToken = verify(accessToken, "hellocaleb");
        req.userId = validToken.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};


module.exports = {generateToken, validateToken}
