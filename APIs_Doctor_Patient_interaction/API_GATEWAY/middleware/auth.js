import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    // console.log("Authentication middleware called");
    // console.log("Request headers are:", req
    // );

    if(req.headers.pathname === "/auth/userauth/login" || req.headers.pathname === "/auth/userauth/register"){
        console.log("No authentication required for login or register");
        return next();
    }


    try {
        const authHeader = req.headers["authorization"];  // FIX: lowercase
        console.log(`authHeader = ${authHeader}\n`);

        if (!authHeader) {
            console.error('Authentication failed: No token provided');
            return res.status(401).json({ message: 'Authentication token is required' });
        }

        const token = authHeader.split(" ")[1];  // Bearer <token>

        jwt.verify(token, process.env.JWT, (err, decodedData) => {
            if (err) {
                console.error("Invalid token error:", err);
                return res.status(403).json({ message: "Invalid token" });
            }
            req.userData = decodedData;  
            req.headers["user-data"] = JSON.stringify(decodedData);
            console.log("User data attached to request headers:", req.headers["user-data"]);
            next();
        });
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(503).json({ "message": "Something went wrong with the API gateway" });
    }
};

export default authenticate;
