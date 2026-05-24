import jwt from "jsonwebtoken"
let auth = (req,res,next) =>
{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token)
    {
        return res.status(401).json({
            error: "no valid token found"
        });
    }
    try
    {
    const decoded =  jwt.verify(token,process.env.SECRET);
    next();
    }
    catch(err)
    {
        return res.status(401).json({
            error: "invalid token"
        });
    }
}

export default auth;