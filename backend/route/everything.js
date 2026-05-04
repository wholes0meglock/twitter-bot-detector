import express from "express"
import { Router } from "express"
// import modelDB from "../modelDB/UserToken"
import auth from "../middleware/auth.js"

const router = Router();

router.post("/", auth, async(req,res) =>
{
    try{
    const {followerCount, followingCount, TotalPosts, DateOfJoin, countTweets} = req.body;

    if(!followerCount || !followingCount || !TotalPosts || !DateOfJoin || !countTweets)
    {
        return res.json("invalid data fetched");
    }
    const response = await fetch("http://127.0.0.1:8000/predict",{
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            followers: followerCount,
            following: followingCount,
            posts: TotalPosts,
            age: DateOfJoin,
        }),
    });

    const result = await response.json();

    return res.json({
        success: true,
        model: result
    })
} catch(err)
{
    return res.status(500).json({error: "server error"})
}

})


export default router;