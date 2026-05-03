import jwt from "jsonwebtoken"
import Router from "express"

const router = Router();

router.get("/", (req,res) =>
{
    const token = jwt.sign(
        {
            deviceID : crypto.randomUUID()
        },
        process.env.SECRET,
        {
            expiresIn : "7d"
        }
    )

    res.json({token});
});


module.exports(router);