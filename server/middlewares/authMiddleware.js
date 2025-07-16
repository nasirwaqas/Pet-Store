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
        console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: 'No token provided', success: false });
        }

        const token = authHeader.split(" ")[1];
        console.log('Token extracted:', token ? 'Token exists' : 'No token');
        console.log('JWT_SECRET in middleware:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
        
        const decode = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log('JWT Verify Error:', err.message);
                    if (err.name === 'TokenExpiredError') {
                        console.log('Token expired at:', new Date(err.expiredAt));
                        reject(new Error('Token expired'));
                    } else {
                        reject(err);
                    }
                } else {
                    console.log('JWT Decoded successfully:', decoded);
                    resolve(decoded);
                }
            });
        });

        req.user = { _id: decode.id };
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error.message);
        
        // Send specific error message for expired tokens
        if (error.message === 'Token expired') {
            return res.status(401).send({ 
                message: 'Token expired. Please login again.', 
                success: false,
                expired: true 
            });
        }
        
        return res.status(401).send({ message: 'Auth failed', success: false });
    }
};