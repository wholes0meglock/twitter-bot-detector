import jwt from "jsonwebtoken"



let auth = (req,res,next) =>
{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token)
    {
        res.send({error: "no valid token found"})
    }
    try
    {
    const decoded =  jwt.verify(token,process.env.SECRET);
    req.user = decoded;
    next();
    }
    catch(err)
    {
        res.json({"Error": "invalid token"});
    }
}