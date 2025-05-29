// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//             if (err) {
//                 return res.status(401).send({ message: 'Auth failed', success: false });
//             } else {
//                 req.body.userId = decode.id;
//                 next();
//             }
//         });
//     } catch (error) {
//         return res.status(401).send({ message: 'Auth failed', success: false });
//     }
// };
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: 'No token provided', success: false });
        }

        const token = authHeader.split(" ")[1];
        const decode = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        req.user = { _id: decode.id }; // Correctly set user object
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(401).send({ message: 'Auth failed', success: false });
    }
};
